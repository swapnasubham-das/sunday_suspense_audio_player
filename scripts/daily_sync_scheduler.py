"""
Sunday Suspense Automated Daily Sync Scheduler
Triggers daily after 6:00 PM - 7:00 PM IST to fetch the latest stories from the YouTube playlist.
"""

import sys
import os
import time
import datetime
import subprocess

# Ensure utf-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Target trigger time in IST (e.g. 19:00 / 7:00 PM IST)
TARGET_HOUR_IST = 19
TARGET_MINUTE_IST = 0

def get_current_ist_time():
    utc_now = datetime.datetime.now(datetime.timezone.utc)
    ist_tz = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
    return utc_now.astimezone(ist_tz)

def run_playlist_sync():
    now_ist = get_current_ist_time()
    print(f"\n=======================================================")
    print(f"⏰ [SYNC TRIGGERED] Current IST Time: {now_ist.strftime('%Y-%m-%d %I:%M:%S %p %Z')}")
    print(f"🔄 Starting playlist fetch & classification...")
    print(f"=======================================================")
    
    script_path = os.path.join(os.path.dirname(__file__), 'fetch_playlist.py')
    try:
        res = subprocess.run([sys.executable, script_path], capture_output=True, text=True, encoding='utf-8')
        print(res.stdout)
        if res.returncode == 0:
            print(f"✅ Sync completed successfully at {get_current_ist_time().strftime('%I:%M:%S %p IST')}")
        else:
            print(f"❌ Error during sync:\n{res.stderr}")
    except Exception as e:
        print(f"❌ Exception during sync execution: {e}")

def get_seconds_until_next_trigger():
    now = get_current_ist_time()
    target_today = now.replace(hour=TARGET_HOUR_IST, minute=TARGET_MINUTE_IST, second=0, microsecond=0)
    
    if now >= target_today:
        # Scheduled for tomorrow
        target_next = target_today + datetime.timedelta(days=1)
    else:
        target_next = target_today
        
    delta = (target_next - now).total_seconds()
    return delta, target_next

def run_scheduler_daemon():
    print("🌙 Sunday Suspense Daily Sync Scheduler Daemon Started")
    print(f"📍 Target Schedule: Daily after {TARGET_HOUR_IST}:00 PM IST (7:00 PM IST / 19:00 IST)")
    now_ist = get_current_ist_time()
    print(f"🕒 Current IST Time: {now_ist.strftime('%Y-%m-%d %I:%M:%S %p')}")
    
    while True:
        seconds_to_wait, next_trigger = get_seconds_until_next_trigger()
        hours = int(seconds_to_wait // 3600)
        minutes = int((seconds_to_wait % 3600) // 60)
        print(f"\n⏳ Next automated sync in {hours}h {minutes}m (at {next_trigger.strftime('%Y-%m-%d %I:%M %p IST')})")
        
        # Sleep until scheduled time
        time.sleep(seconds_to_wait)
        
        # Run sync
        run_playlist_sync()
        
        # Small grace sleep to prevent duplicate trigger within the same minute
        time.sleep(65)

if __name__ == '__main__':
    if '--run-once' in sys.argv:
        print("Running one-time playlist sync...")
        run_playlist_sync()
    else:
        run_scheduler_daemon()
