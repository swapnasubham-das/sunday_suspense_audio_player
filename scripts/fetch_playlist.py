import json
import re
import sys
import os
import time
import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import yt_dlp

sys.stdout.reconfigure(encoding='utf-8')

PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLq71IJk8mCV4qyVnGjydfB9PvEaUqozMt'

KNOWN_AUTHORS = [
    ("Taradas Bandopadhyay", "তারাদাস বন্দ্যোপাধ্যায়"),
    ("Taradas Bandyopadhyay", "তারাদাস বন্দ্যোপাধ্যায়"),
    ("Bibhutibhushan Bandopadhyay", "বিভূতিভূষণ বন্দ্যোপাধ্যায়"),
    ("Bibhutibhushan Bandyopadhyay", "বিভূতিভূষণ বন্দ্যোপাধ্যায়"),
    ("Manik Bandopadhyay", "মানিক বন্দ্যোপাধ্যায়"),
    ("Manik Bandyopadhyay", "মানিক বন্দ্যোপাধ্যায়"),
    ("Sharadindu Bandyopadhyay", "শরদিন্দু বন্দ্যোপাধ্যায়"),
    ("Saradindu Bandopadhyay", "শরদিন্দু বন্দ্যোপাধ্যায়"),
    ("Saradindu", "শরদিন্দু বন্দ্যোপাধ্যায়"),
    ("Satyajit Ray", "সত্যজিৎ রায়"),
    ("Satyajit", "সত্যজিৎ রায়"),
    ("Indranil Sanyal", "ইন্দ্রনীল সান্যাল"),
    ("Abhigyan Ganguly", "অভিজ্ঞান গাঙ্গুলী"),
    ("Himadri Kishore Dasgupta", "হিমাদ্রিকিশোর দাশগুপ্ত"),
    ("Himadrikishore Dasgupta", "হিমাদ্রিকিশোর দাশগুপ্ত"),
    ("Arthur Conan Doyle", "আর্থার কোনান ডয়েল"),
    ("Conan Doyle", "আর্থার কোনান ডয়েল"),
    ("Edgar Allan Poe", "এডগার অ্যালান পো"),
    ("Hemendra Kumar Roy", "হেমেন্দ্রকুমার রায়"),
    ("Shirshendu Mukhopadhyay", "শীর্ষেন্দু মুখোপাধ্যায়"),
    ("Shirshendu", "শীর্ষেন্দু মুখোপাধ্যায়"),
    ("Sunil Gangopadhyay", "সুনীল গঙ্গোপাধ্যায়"),
    ("Nihar Ranjan Gupta", "নীহাররঞ্জন গুপ্ত"),
    ("Nihar Ranjan", "নীহাররঞ্জন গুপ্ত"),
    ("Sayak Aman", "সায়ক আমন"),
    ("Debarati Mukhopadhyay", "দেবারতি মুখোপাধ্যায়"),
    ("Sanjoy Bhattacharya", "সঞ্জয় ভট্টাচার্য"),
    ("Avik Sarkar", "অভীক সরকার"),
    ("Rupak Saha", "রূপক সাহা"),
    ("Sourav Chakraborty", "সৌরভ চক্রবর্তী"),
    ("Rajat Kanti Dey", "রজতকান্তি দে"),
    ("Premendra Mitra", "প্রেমেন্দ্র মিত্র"),
    ("Narayan Gangopadhyay", "নারায়ণ গঙ্গোপাধ্যায়"),
    ("Rabindranath Tagore", "রবীন্দ্রনাথ ঠাকুর"),
    ("Tagore", "রবীন্দ্রনাথ ঠাকুর"),
    ("Sarat Chandra Chattopadhyay", "শরৎচন্দ্র চট্টোপাধ্যায়"),
    ("Bankim Chandra", "বঙ্কিমচন্দ্র চট্টোপাধ্যায়"),
    ("Syed Mustafa Siraj", "সৈয়দ মুস্তাফা সিরাজ"),
    ("Mustafa Siraj", "সৈয়দ মুস্তাফা সিরাজ"),
    ("Bram Stoker", "ব্রাম স্টোকার"),
    ("Mary Shelley", "ম্যারি শেলি"),
    ("Agatha Christie", "আগাথা ক্রিস্টি"),
    ("Suchitra Bhattacharya", "সুচিত্রা ভট্টাচার্য"),
    ("Swapan Kumar", "স্বপন কুমার"),
    ("Sasthipada Chattopadhyay", "ষষ্ঠীপদ চট্টোপাধ্যায়"),
    ("Adrish Bardhan", "অদ্রীশ বর্ধন"),
    ("Troilokyanath Mukhopadhyay", "ত্রৈলোক্যনাথ মুখোপাধ্যায়"),
    ("Upendrakishore Ray Chowdhury", "উপেন্দ্রকিশোর রায়চৌধুরী"),
    ("Sukumar Ray", "সুকুমার রায়"),
    ("Leela Majumdar", "লীলা মজুমদার")
]

NOISE_TOKENS = {
    'sunday suspense', 'sunday suspense classics', 'sunday suspense special',
    'mirchi bangla audio story', 'mirchi bangla', 'audio story',
    'sunday suspense mega episode', 'sunday suspense audio story',
    'bengali audio story', 'audio story | mirchi bangla', 'mirchi 98.3',
    'mega episode', 'full audio story', 'special episode', 'mirchi suspense',
    'bengali audio drama', 'radio mirchi', 'sunday suspense live', 'full episode',
    'mirchi', 'audiobook', 'bengali audiobook'
}

def clean_story_title_and_author(title_raw):
    raw_parts = [p.strip() for p in re.split(r'[|•\–\-]', title_raw) if p.strip()]
    meaningful = [p for p in raw_parts if p.lower() not in NOISE_TOKENS]
    
    # Author detection
    author = "Sunday Suspense"
    for auth_en, auth_bn in KNOWN_AUTHORS:
        if auth_en.lower() in title_raw.lower() or auth_bn in title_raw:
            author = auth_bn
            break
            
    display_parts = []
    en_parts = []
    
    for p in meaningful:
        # Skip if part is author name
        is_auth = False
        for auth_en, auth_bn in KNOWN_AUTHORS:
            if auth_en.lower() in p.lower() or auth_bn in p:
                is_auth = True
                break
        if is_auth:
            continue
            
        # Keep every non-author part (Bengali AND English) in original order,
        # so distinct info like an English episode name isn't silently dropped
        # just because a Bengali part also exists in the same raw title.
        display_parts.append(p)
        if not re.search(r'[\u0980-\u09FF]', p):
            en_parts.append(p)
            
    display_title = " - ".join(display_parts) if display_parts else title_raw
    title_en = " - ".join(en_parts) if en_parts else display_title
    
    return display_title, title_en, author

def classify_genre(title_raw, display_title, author):
    text = f"{title_raw} {display_title} {author}".lower()
    
    # Horror checks
    if any(k in text for k in [
        'ভুত', 'ভূত', 'horror', 'ghost', 'haunted', 'প্রেত', 'পিশাচ', 'dracula',
        'frankenstein', 'shiver', 'তারানাথ', 'taranath', 'অভিশপ্ত', 'ডাইনি', 'কঙ্কাল',
        'bloody', 'dark', 'অশরীরী', 'কবর', 'তান্ত্রিক', 'রক্ত', 'শ্মশান', 'শয়তান',
        'কাপালিক', 'অতিলৌকিক', 'প্রেতাত্মা', 'অলৌকিক', 'কফিন', 'নরখাদক', 'ডাইনির',
        'haunting', 'vampire', 'witch', 'monk', 'demon', 'bhoot', 'chaya', 'ছায়া'
    ]):
        return 'horror'
        
    # Mystery & Detective checks
    if any(k in text for k in [
        'byomkesh', 'ব্যোমকেশ', 'feluda', 'ফেলুদা', 'detective', 'mystery', 'গোয়েন্দা',
        'sherlock', 'রহস্য', 'shobor', 'kiriti', 'কিরীটী', 'investigation', 'killer',
        'murder', 'খুন', 'সত্যজিৎ', 'satyajit ray', 'shonku', 'শঙ্কু', 'kakababu',
        'কাকাবাবু', 'সৈয়দ মুস্তাফা সিরাজ', 'নীলাদ্রি', 'murderer', 'crime', 'clue',
        'গোয়েন্দাগিরি', 'হত্যা', 'তদন্ত', 'নীহাররঞ্জন', 'অপরাধ', 'চক্রান্ত'
    ]):
        return 'mystery'
        
    # Classic Novel / Literature checks
    if any(k in text for k in [
        'novel', 'উপন্যাস', 'classic', 'rabindranath', 'tagore', 'রবীন্দ্রনাথ',
        'sharatchandra', 'শরৎচন্দ্র', 'bibhutibhushan', 'বিভূতিভূষণ', 'বঙ্কিমচন্দ্র',
        'মানিক', 'আশাপূর্ণা', 'হিমাদ্রিকিশোর', 'শীর্ষেন্দু', 'বুদ্ধদেব গুহ',
        'সমরেশ মজুমদার', 'সাহিত্য', 'গল্পগুচ্ছ', 'পোস্টমাস্টার', 'নষ্টনীড়',
        'দেনা পাওনা', 'শ্রীকান্ত', 'পথের পাঁচালী', 'দেবদাস', 'পোস্টমাস্টার'
    ]):
        return 'novel'
        
    # Adventure checks
    if any(k in text for k in [
        'adventure', 'অভিযান', 'পাহাড়', 'forest', 'অরণ্য', 'চাঁদের পাহাড়', 'আফ্রিকা',
        'ঘনাদা', 'প্রেমেন্দ্র মিত্র', 'টেনিদা', 'নারায়ণ গঙ্গোপাধ্যায়', 'জঙ্গল',
        'সমুদ্র', 'জলদস্যু', 'শিকার', 'ট্রেজার', 'অ্যামাজন', 'মেরু', 'হিমালয়',
        'ট্রেকিং', 'গুহা', 'দ্বীপ', 'দ্বীপের'
    ]):
        return 'adventure'
        
    return 'thriller'

def fetch_video_timestamp(item):
    vid = item.get('id')
    raw_title = item.get('title') or ''
    # Fast path: check if timestamp is already in flat item
    ts = item.get('timestamp') or item.get('release_timestamp')
    up_date = item.get('upload_date')
    
    if ts and up_date:
        return vid, ts, up_date
        
    # Query video info
    ydl_opts = {'quiet': True, 'skip_download': True, 'extract_flat': False}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
            v_ts = info.get('timestamp') or info.get('release_timestamp')
            v_date = info.get('upload_date')
            return vid, v_ts, v_date
        except Exception:
            return vid, None, None

def fetch_and_save_all_stories():
    print(f"Fetching all playlist entries from: {PLAYLIST_URL} ...")
    
    ydl_opts = {
        'extract_flat': True,
        'skip_download': True,
        'quiet': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(PLAYLIST_URL, download=False)
        entries = info.get('entries', [])
        
    print(f"Successfully extracted {len(entries)} playlist items from YouTube!")
    
    genre_bn_map = {
        "horror": "ভৌতিক ও অলৌকিক",
        "mystery": "রহস্য ও গোয়েন্দা",
        "thriller": "সাসপেন্স ও রোমাঞ্চ",
        "novel": "কালজয়ী সাহিত্য",
        "adventure": "দুঃসাহসিক অভিযান"
    }
    
    # Load existing content to reuse timestamps if already fetched
    out_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'content.json')
    cached_dates = {}
    if os.path.exists(out_file):
        try:
            with open(out_file, 'r', encoding='utf-8') as f:
                old_list = json.load(f)
                for s in old_list:
                    if s.get('timestamp') or s.get('uploadDate'):
                        cached_dates[s['id']] = (s.get('timestamp'), s.get('uploadDate'))
        except:
            pass

    stories_temp = []
    seen_ids = set()
    needed_fetch = []
    
    # Base timestamp index calculation in case yt metadata is unavailable
    base_time = int(time.time())
    
    for idx, item in enumerate(entries):
        video_id = item.get('id')
        title_raw = (item.get('title') or '').strip()
        
        if not video_id or not title_raw:
            continue
        if video_id in seen_ids:
            continue
        if title_raw.lower() in ['[private video]', '[deleted video]']:
            continue
            
        seen_ids.add(video_id)
        
        # Duration
        dur_sec = int(item.get('duration') or 0)
        if dur_sec >= 3600:
            dur_formatted = f"{dur_sec // 3600}:{(dur_sec % 3600) // 60:02d}:{dur_sec % 60:02d}"
        elif dur_sec > 0:
            dur_formatted = f"{dur_sec // 60}:{dur_sec % 60:02d}"
        else:
            dur_formatted = "Full Audio"
            dur_sec = 2400
            
        thumbnail = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
        display_title, title_en, author = clean_story_title_and_author(title_raw)
        genre = classify_genre(title_raw, display_title, author)
        
        # Check cache
        cached = cached_dates.get(video_id)
        if cached and cached[0]:
            ts, up_date = cached
        else:
            # Fallback estimated timestamp from reverse playlist order (idx 0 is newest)
            ts = base_time - (idx * 86400 * 2) # approx 2 days between releases
            up_date = datetime.datetime.fromtimestamp(ts, datetime.timezone.utc).strftime('%Y%m%d')
            # Add top 50 recent items to precise detail fetch
            if idx < 50:
                needed_fetch.append(item)
                
        stories_temp.append({
            "id": video_id,
            "title": display_title,
            "titleEn": title_en,
            "rawTitle": title_raw,
            "author": author,
            "narrator": "Mirchi Bangla (Sunday Suspense)",
            "genre": genre,
            "genreBn": genre_bn_map.get(genre, "সাসপেন্স ও রোমাঞ্চ"),
            "durationSec": dur_sec,
            "durationFormatted": dur_formatted,
            "timestamp": ts,
            "uploadDate": f"{up_date[:4]}-{up_date[4:6]}-{up_date[6:8]}" if len(up_date) == 8 else up_date,
            "thumbnail": thumbnail,
            "youtubeUrl": f"https://www.youtube.com/watch?v={video_id}"
        })
        
    # Parallel fetch exact upload dates for recent videos
    if needed_fetch:
        print(f"Fetching exact release timestamps for the latest {len(needed_fetch)} episodes...")
        with ThreadPoolExecutor(max_workers=20) as executor:
            future_to_vid = {executor.submit(fetch_video_timestamp, it): it.get('id') for it in needed_fetch}
            for future in as_completed(future_to_vid):
                vid, v_ts, v_date = future.result()
                if v_ts and v_date:
                    for s in stories_temp:
                        if s['id'] == vid:
                            s['timestamp'] = v_ts
                            s['uploadDate'] = f"{v_date[:4]}-{v_date[4:6]}-{v_date[6:8]}" if len(v_date) == 8 else v_date
                            try:
                                dt = datetime.datetime.fromtimestamp(v_ts, datetime.timezone.utc)
                                s['publishedFormatted'] = dt.strftime('%d %b %Y')
                            except:
                                pass
                            break
                            
    # Sort strictly by timestamp descending (newest / most recent story at index 0)
    stories_temp.sort(key=lambda s: s.get('timestamp', 0), reverse=True)
    
    # Format published dates for all
    for s in stories_temp:
        if not s.get('publishedFormatted') and s.get('timestamp'):
            try:
                dt = datetime.datetime.fromtimestamp(s['timestamp'], datetime.timezone.utc)
                s['publishedFormatted'] = dt.strftime('%d %b %Y')
            except:
                pass
                
    print(f"\nProcessed {len(stories_temp)} stories sorted by exact upload date & time!")
    print(f"🌟 LATEST SELECTED DRAMA (Index 0): '{stories_temp[0]['title']}' ({stories_temp[0]['author']}) - Upload Date: {stories_temp[0].get('uploadDate')} (Timestamp: {stories_temp[0].get('timestamp')})")
    
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(stories_temp, f, indent=2, ensure_ascii=False)
    print(f"Saved catalog to {out_file}")

if __name__ == '__main__':
    fetch_and_save_all_stories()
