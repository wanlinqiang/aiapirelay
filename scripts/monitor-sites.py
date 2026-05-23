#!/usr/bin/env python3
"""
monitor-sites.py - 每日监控所有站点可用性和延迟
运行方式: python3 scripts/monitor-sites.py
触发: 每日 Cron Job (09:00)
依赖: pip3 install requests

功能:
  1. 检测每个站点的 HTTP 状态码
  2. 测量响应延迟
  3. 检测价格 API 可用性
  4. 对比历史状态，检测变化
  5. 推送 Telegram 预警
"""

import json
import os
import sys
import time
import requests
from datetime import datetime, timezone
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional

# ============================================
# 配置
# ============================================

SITES = {
    'yunwu': {
        'name': '云雾 API',
        'checkUrl': 'https://yunwu.ai',
        'pricingApi': 'https://yunwu.ai/api/pricing',
        'expectedStatus': 200,
    },
    'bltcy': {
        'name': '柏拉图 AI',
        'checkUrl': 'https://api.bltcy.ai',
        'pricingApi': 'https://api.bltcy.ai/api/pricing',
        'expectedStatus': 200,
    },
    'rcouyi': {
        'name': 'No.1-API',
        'checkUrl': 'https://api.rcouyi.com',
        'pricingApi': 'https://api.rcouyi.com/api/pricing',
        'expectedStatus': 200,
    },
    'closeai': {
        'name': 'CloseAI',
        'checkUrl': 'https://www.closeai-asia.com',
        'pricingApi': '',
        'expectedStatus': 200,
    },
    'uiuiapi': {
        'name': 'UiUiAPI',
        'checkUrl': 'https://uiuiapi.com',
        'pricingApi': '',
        'expectedStatus': 200,
    },
    'gptgod': {
        'name': 'GPTGOD',
        'checkUrl': 'https://gptgod.online',
        'pricingApi': '',
        'expectedStatus': 200,
    },
    'mkeai': {
        'name': 'MKEAI',
        'checkUrl': 'https://mkeai.com',
        'pricingApi': '',
        'expectedStatus': 200,
    },
}

SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
STATUS_FILE = ROOT_DIR / 'data' / 'previous-status.json'
STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)

# ============================================
# 数据模型
# ============================================

@dataclass
class SiteStatus:
    station_id: str
    name: str
    url: str
    status_code: Optional[int]
    latency_ms: Optional[float]
    pricing_api_status: Optional[int]
    pricing_api_latency_ms: Optional[float]
    timestamp: str
    error: Optional[str] = None
    is_down: bool = False

# ============================================
# 工具函数
# ============================================

def log(msg: str, emoji: str = '📋'):
    print(f'[{datetime.now().strftime("%H:%M:%S")}] {emoji} {msg}')

def load_previous_status() -> dict:
    """加载上次的监控状态"""
    if STATUS_FILE.exists():
        with STATUS_FILE.open() as f:
            return {s['station_id']: s for s in json.load(f)}
    return {}

def save_current_status(status_list: list):
    """保存当前状态"""
    STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with STATUS_FILE.open('w') as f:
        json.dump(status_list, f, ensure_ascii=False, indent=2)

# ============================================
# 检测逻辑
# ============================================

def check_site(site_id: str, config: dict) -> SiteStatus:
    """检测单个站点的可用性"""
    status = SiteStatus(
        station_id=site_id,
        name=config['name'],
        url=config['checkUrl'],
        status_code=None,
        latency_ms=None,
        pricing_api_status=None,
        pricing_api_latency_ms=None,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )

    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; AIRelayBot/1.0; +https://aitoolbox.cc)',
    }

    try:
        # 检测主页
        start = time.time()
        resp = requests.get(config['checkUrl'], timeout=15, headers=headers)
        status.latency_ms = round((time.time() - start) * 1000, 1)
        status.status_code = resp.status_code

        if resp.status_code != 200:
            status.is_down = True
    except requests.exceptions.Timeout:
        status.error = 'timeout'
        status.is_down = True
        log(f'{config["name"]}: 超时', '❌')
        return status
    except Exception as e:
        status.error = str(e)
        status.is_down = True
        log(f'{config["name"]}: {e}', '❌')
        return status

    # 检测价格 API
    pricing_api = config.get('pricingApi')
    if pricing_api:
        try:
            start = time.time()
            resp2 = requests.get(pricing_api, timeout=15, headers={
                **headers,
                'Accept': 'application/json',
            })
            status.pricing_api_latency_ms = round((time.time() - start) * 1000, 1)
            status.pricing_api_status = resp2.status_code
        except:
            status.pricing_api_status = 0

    return status

def check_all_sites() -> list:
    """检测所有站点"""
    results = []
    for site_id, config in SITES.items():
        result = check_site(site_id, config)
        results.append(result)

        latency_str = f'{result.latency_ms}ms' if result.latency_ms else 'N/A'
        api_status = str(result.pricing_api_status) if result.pricing_api_status else 'N/A'

        if result.is_down:
            log(f'{config["name"]}: HTTP {result.status_code}, 延迟 {latency_str}, API {api_status}', '🔴')
        else:
            log(f'{config["name"]}: HTTP {result.status_code}, 延迟 {latency_str}, API {api_status}', '✅')

        time.sleep(0.5)

    return results

# ============================================
# 变化检测
# ============================================

def detect_changes(old: dict, new_list: list) -> list:
    """对比新旧状态，检测显著变化"""
    changes = []

    for new_status in new_list:
        site_id = new_status.station_id
        old_status = old.get(site_id)

        if old_status is None:
            changes.append({
                'type': 'new',
                'site_id': site_id,
                'name': new_status.name,
                'severity': 'info',
                'message': f'新站点监控: {new_status.name}'
            })
            continue

        # 检测状态码变化
        if new_status.status_code != old_status.get('status_code'):
            if new_status.status_code and new_status.status_code != 200:
                changes.append({
                    'type': 'down',
                    'site_id': site_id,
                    'name': new_status.name,
                    'severity': 'high',
                    'old_status': old_status.get('status_code'),
                    'new_status': new_status.status_code,
                    'message': f'🚨 {new_status.name} 疑似宕机 (HTTP {new_status.status_code})'
                })
            elif old_status.get('status_code') != 200:
                changes.append({
                    'type': 'recovered',
                    'site_id': site_id,
                    'name': new_status.name,
                    'severity': 'low',
                    'old_status': old_status.get('status_code'),
                    'new_status': new_status.status_code,
                    'message': f'✅ {new_status.name} 已恢复 (HTTP {new_status.status_code})'
                })

        # 检测延迟异常（超过 2 倍或超过 3000ms）
        old_latency = old_status.get('latency_ms')
        new_latency = new_status.latency_ms
        if old_latency and new_latency:
            ratio = new_latency / old_latency
            if ratio > 2.0 or new_latency > 3000:
                changes.append({
                    'type': 'latency_spike',
                    'site_id': site_id,
                    'name': new_status.name,
                    'severity': 'medium',
                    'old_latency': old_latency,
                    'new_latency': new_latency,
                    'message': f'⚠️ {new_status.name} 延迟异常: {old_latency}ms → {new_latency}ms'
                })

        # 检测价格 API 不可用
        old_api_status = old_status.get('pricing_api_status')
        new_api_status = new_status.pricing_api_status
        if old_api_status and new_api_status == 0:
            changes.append({
                'type': 'api_down',
                'site_id': site_id,
                'name': new_status.name,
                'severity': 'medium',
                'message': f'⚠️ {new_status.name} 价格 API 不可用'
            })

    return changes

# ============================================
# Telegram 预警
# ============================================

def send_telegram(message: str):
    """发送 Telegram 消息"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')

    if not bot_token or not chat_id:
        log('Telegram 未配置，跳过通知')
        return

    try:
        url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
        resp = requests.post(url, json={
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'HTML'
        }, timeout=10)
        if resp.status_code != 200:
            log(f'Telegram 发送失败: {resp.status_code}', '❌')
    except Exception as e:
        log(f'Telegram 错误: {e}', '❌')

def format_alert(changes: list) -> str:
    """格式化预警消息"""
    if not changes:
        return ''

    lines = ['🔔 <b>AI 中转站监控日报</b>', '']
    lines.append(f'时间: {datetime.now().strftime("%Y-%m-%d %H:%M")}', '')
    lines.append('---')

    for c in changes:
        severity_emoji = {
            'high': '🚨',
            'medium': '⚠️',
            'low': 'ℹ️',
            'info': '🆕'
        }.get(c['severity'], '')

        lines.append(f"{severity_emoji} {c['message']}")

    lines.append('')
    lines.append('来自 aiapirelay 监控机器人')

    return '\n'.join(lines)

# ============================================
# 主程序
# ============================================

def main():
    log('开始站点监控...', '🚀')

    # 检测所有站点
    current_status = check_all_sites()

    # 加载历史状态
    previous_status = load_previous_status()

    # 检测变化
    if previous_status:
        changes = detect_changes(previous_status, current_status)

        if changes:
            log(f'检测到 {len(changes)} 个变化', '⚠️')
            for c in changes:
                log(f"  {c['message']}")

            # 发送 Telegram
            alert_msg = format_alert(changes)
            if alert_msg:
                send_telegram(alert_msg)
                log('预警已发送', '📱')
        else:
            log('无状态变化', '✓')
    else:
        log('首次运行，无历史数据', 'ℹ️')

    # 保存当前状态
    serializable = [asdict(s) for s in current_status]
    save_current_status(serializable)
    log('状态已保存', '💾')

    # 统计
    total = len(current_status)
    up = sum(1 for s in current_status if not s.is_down)
    down = total - up
    log(f'统计: {up}/{total} 在线', '📊')

    log('监控完成', '🏁')

if __name__ == '__main__':
    main()
