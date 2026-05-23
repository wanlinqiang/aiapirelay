#!/usr/bin/env python3
"""
fetch-pricing.py - 每日抓取所有中转站价格数据
运行方式: python3 scripts/fetch-pricing.py
触发: 每日 Cron Job (09:00)
依赖: pip3 install requests pyyaml

功能:
  1. 抓取所有站点的 /api/pricing 端点
  2. 解析并标准化价格数据
  3. 保存到 data/pricing-history/{date}.json
  4. 检测价格变化，发 Telegram 预警
"""

import json
import os
import sys
import time
import requests
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ============================================
# 配置
# ============================================

STATIONS = {
    'yunwu': {
        'url': 'https://yunwu.ai/api/pricing',
        'type': 'mixed',
        'name': '云雾 API'
    },
    'bltcy': {
        'url': 'https://api.bltcy.ai/api/pricing',
        'type': 'mixed',
        'name': '柏拉图 AI'
    },
    'rcouyi': {
        'url': 'https://api.rcouyi.com/api/pricing',
        'type': 'aggregator',
        'name': 'No.1-API'
    },
    # 更多站点可在此添加
}

# 输出目录
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
HISTORY_DIR = ROOT_DIR / 'data' / 'pricing-history'
HISTORY_DIR.mkdir(parents=True, exist_ok=True)

# ============================================
# 工具函数
# ============================================

def log(msg: str, emoji: str = '📋'):
    print(f'[{datetime.now().strftime("%H:%M:%S")}] {emoji} {msg}')

def fetch_json(url: str, timeout: int = 15) -> Optional[dict]:
    """抓取 JSON 数据，带超时和错误处理"""
    try:
        resp = requests.get(url, timeout=timeout, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; AIRelayBot/1.0; +https://aitoolbox.cc)',
            'Accept': 'application/json',
        })
        if resp.status_code == 200:
            return resp.json()
        else:
            log(f'HTTP {resp.status_code}: {url}', '❌')
            return None
    except requests.exceptions.Timeout:
        log(f'超时: {url}', '❌')
        return None
    except Exception as e:
        log(f'错误: {e}', '❌')
        return None

def load_history(date_str: str) -> dict:
    """加载某一天的价格历史"""
    f = HISTORY_DIR / f'{date_str}.json'
    if f.exists():
        return json.load(f.open())
    return {}

def save_history(data: dict, date_str: str):
    """保存价格历史"""
    f = HISTORY_DIR / f'{date_str}.json'
    json.dump(data, f.open('w'), ensure_ascii=False, indent=2)

def load_previous_day(date_str: str) -> Optional[dict]:
    """加载前一天的价格数据（用于对比）"""
    prev = datetime.strptime(date_str, '%Y-%m-%d')
    prev = prev.replace(day=prev.day - 1)
    prev_str = prev.strftime('%Y-%m-%d')
    f = HISTORY_DIR / f'{prev_str}.json'
    if f.exists():
        return json.load(f.open())
    return None

# ============================================
# 各站点解析器
# ============================================

def parse_yunwu(data: dict) -> dict:
    """
    解析云雾 API 的 /api/pricing 返回格式

    数据结构:
      data.model_group[groupName].ModelPrice[modelId] = {priceType, price}
      data.model_group[groupName].GroupRatio = multiplier
    """
    result = {
        'station': 'yunwu',
        'name': '云雾 API',
        'fetchedAt': datetime.now(timezone.utc).isoformat(),
        'models': {},
        'modelCount': 0,
        'groups': []
    }

    model_groups = data.get('data', {}).get('model_group', {})

    for group_name, group_data in model_groups.items():
        ratio = group_data.get('GroupRatio', 1)
        group_display = group_data.get('DisplayName', group_name)

        for model_id, price_info in group_data.get('ModelPrice', {}).items():
            price_type = price_info.get('priceType', 0)  # 0=input, 1=output
            price_val = price_info.get('price', 0)

            if model_id not in result['models']:
                result['models'][model_id] = {
                    'input': None,
                    'output': None,
                    'ratio': ratio,
                    'group': group_display,
                    'groups': []
                }

            entry = result['models'][model_id]
            entry['groups'].append({
                'group': group_display,
                'ratio': ratio,
                'priceType': price_type,
                'price': price_val
            })

            if price_type == 0:  # input
                entry['input'] = round(price_val * ratio, 6)
            elif price_type == 1:  # output/special
                if entry['output'] is None:
                    entry['output'] = round(price_val * ratio, 6)

    result['modelCount'] = len(result['models'])
    result['groups'] = list(model_groups.keys())
    return result

def parse_bltcy(data: dict) -> dict:
    """
    解析柏拉图 AI 的 /api/pricing 返回格式

    数据结构:
      data.data[].model_name, model_price, model_ratio, completion_ratio
    """
    result = {
        'station': 'bltcy',
        'name': '柏拉图 AI',
        'fetchedAt': datetime.now(timezone.utc).isoformat(),
        'models': {},
        'modelCount': 0
    }

    models = data.get('data', [])

    for m in models:
        model_name = m.get('model_name', '')
        price = m.get('model_price', 0)
        ratio = m.get('model_ratio', 1)
        completion_ratio = m.get('completion_ratio', 1)

        if not model_name:
            continue

        input_price = round(price * ratio, 6)
        output_price = round(price * ratio * completion_ratio, 6) if completion_ratio else None

        result['models'][model_name] = {
            'input': input_price,
            'output': output_price,
            'ratio': ratio,
            'completionRatio': completion_ratio,
            'group': m.get('enable_groups', ['default'])[0] if m.get('enable_groups') else 'default'
        }

    result['modelCount'] = len(result['models'])
    return result

def parse_rcouyi(data: dict) -> dict:
    """
    解析 No.1-API 的 /api/pricing 返回格式
    """
    result = {
        'station': 'rcouyi',
        'name': 'No.1-API',
        'fetchedAt': datetime.now(timezone.utc).isoformat(),
        'models': {},
        'modelCount': 0
    }

    models = data.get('data', [])

    for m in models:
        model_name = m.get('model_name', '')
        price = m.get('model_price', 0)
        ratio = m.get('model_ratio', 1)
        completion_ratio = m.get('completion_ratio', 1)

        if not model_name:
            continue

        input_price = round(price * ratio, 6)
        output_price = round(price * ratio * completion_ratio, 6) if completion_ratio else None

        result['models'][model_name] = {
            'input': input_price,
            'output': output_price,
            'ratio': ratio,
            'completionRatio': completion_ratio
        }

    result['modelCount'] = len(result['models'])
    return result

def parse_generic(data: dict, station_id: str) -> dict:
    """通用解析器 - 尝试常见的 price 字段"""
    result = {
        'station': station_id,
        'fetchedAt': datetime.now(timezone.utc).isoformat(),
        'models': {},
        'modelCount': 0,
        'note': 'generic parser'
    }

    # 尝试找 models/prices/pricing 字段
    models_data = data.get('models') or data.get('prices') or data.get('pricing') or []

    if isinstance(models_data, dict):
        for model_id, price_info in models_data.items():
            if isinstance(price_info, dict):
                result['models'][model_id] = {
                    'input': price_info.get('input') or price_info.get('price') or price_info.get('price_in', 0),
                    'output': price_info.get('output') or price_info.get('price_out') or price_info.get('price_out', 0)
                }
            elif isinstance(price_info, (int, float)):
                result['models'][model_id] = {'input': price_info, 'output': None}

    elif isinstance(models_data, list):
        for m in models_data:
            model_id = m.get('name') or m.get('model') or m.get('model_name', '')
            result['models'][model_id] = {
                'input': m.get('price') or m.get('price_in', 0),
                'output': m.get('price_out', 0)
            }

    result['modelCount'] = len(result['models'])
    return result

PARSERS = {
    'yunwu': parse_yunwu,
    'bltcy': parse_bltcy,
    'rcouyi': parse_rcouyi,
}

def parse_pricing(station_id: str, data: dict) -> dict:
    """根据站点 ID 选择解析器"""
    parser = PARSERS.get(station_id, lambda d: parse_generic(d, station_id))
    return parser(data)

# ============================================
# 价格变化检测
# ============================================

def detect_price_changes(old_data: dict, new_data: dict, threshold: float = 0.01) -> list:
    """
    检测价格变化
    threshold: 变化百分比阈值（默认 1%）
    """
    changes = []

    if not old_data:
        return changes

    new_models = new_data.get('models', {})
    old_models = old_data.get('models', {})

    for model_id, new_price in new_models.items():
        old_price = old_models.get(model_id)
        if old_price is None:
            continue

        old_input = old_price.get('input')
        new_input = new_price.get('input')

        if old_input and new_input and old_input > 0:
            change_pct = (new_input - old_input) / old_input
            if abs(change_pct) >= threshold:
                changes.append({
                    'model': model_id,
                    'oldPrice': old_input,
                    'newPrice': new_input,
                    'changePercent': round(change_pct * 100, 2),
                    'direction': 'up' if change_pct > 0 else 'down',
                    'station': new_data.get('station'),
                    'name': new_data.get('name')
                })

    return changes

# ============================================
# Telegram 预警
# ============================================

def send_telegram(message: str):
    """发送 Telegram 消息（通过 Hermes cron 环境变量）"""
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

def format_price_alert(changes: list) -> str:
    """格式化价格变化消息"""
    if not changes:
        return ''

    lines = ['📊 <b>价格变动预警</b>', '']
    for c in changes:
        emoji = '🔴' if c['direction'] == 'up' else '🟢'
        lines.append(
            f"{emoji} <b>{c['name']}</b>"
        )
        lines.append(
            f"   {c['model']}: ¥{c['oldPrice']} → ¥{c['newPrice']} "
            f"({c['changePercent']:+.1f}%)"
        )
    lines.append('')
    lines.append('来自 aiapirelay 监控机器人')
    return '\n'.join(lines)

def format_new_models_alert(new_station_data: dict) -> str:
    """格式化新模型发现消息"""
    lines = ['🆕 <b>新增模型发现</b>', '']

    for station_id, data in new_station_data.items():
        if data.get('newModels'):
            lines.append(f"<b>{data.get('name', station_id)}</b>")
            for model in data['newModels'][:5]:
                lines.append(f"   + {model}")
            if len(data['newModels']) > 5:
                lines.append(f"   ... 还有 {len(data['newModels']) - 5} 个")
            lines.append('')

    if len(lines) > 2:
        lines.append('来自 aiapirelay 监控机器人')
        return '\n'.join(lines)
    return ''

# ============================================
# 主程序
# ============================================

def main():
    date_str = datetime.now().strftime('%Y-%m-%d')
    log(f'开始抓取价格数据 [{date_str}]', '🚀')

    # 加载历史数据
    today_history = load_history(date_str)
    prev_history = load_previous_day(date_str)

    all_changes = []

    for station_id, config in STATIONS.items():
        name = config.get('name', station_id)
        url = config['url']

        log(f'抓取 {name}...', '⏳')

        data = fetch_json(url)
        if data is None:
            log(f'{name}: 抓取失败', '❌')
            today_history[station_id] = {'error': 'fetch_failed', 'station': station_id}
            continue

        # 解析
        parsed = parse_pricing(station_id, data)
        today_history[station_id] = parsed

        log(f'{name}: {parsed.get("modelCount", 0)} 个模型', '✅')

        # 检测变化
        if prev_history and station_id in prev_history:
            changes = detect_price_changes(prev_history[station_id], parsed)
            if changes:
                all_changes.extend(changes)
                log(f'  发现 {len(changes)} 个价格变化', '⚠️')

        time.sleep(1)  # 避免请求过快

    # 保存
    save_history(today_history, date_str)
    log(f'数据已保存到 {HISTORY_DIR / f"{date_str}.json"}', '💾')

    # 发预警
    if all_changes:
        msg = format_price_alert(all_changes)
        if msg:
            send_telegram(msg)
            log('价格变动预警已发送', '📱')
    else:
        log('无价格变动', '✓')

    log('抓取完成', '🏁')

if __name__ == '__main__':
    main()
