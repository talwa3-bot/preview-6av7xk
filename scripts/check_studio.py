"""Content and release guards for explicit client requirements."""
import json
import re
import hashlib
from html.parser import HTMLParser
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'studio'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__(); self.ids=[]; self.links=[]; self.data=[]; self.h1=0; self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        for field in ('href','src'):
            if a.get(field):self.links.append(a[field])
    def handle_data(self,data):self.data.append(data)

services=json.loads((OUT/'services.json').read_text())
assert len(services)==22
assert len({s['id'] for s in services})==len(services)
for s in services:
    for field in ('title','department','intro','output','clients'):
        assert len(s[field])==2 and all(s[field]), (s['id'],field)
    assert all(len(items)==3 for items in s['items'])
for filename in (p.name for p in OUT.glob('*.html')):
    text=(OUT/filename).read_text();page=Page(text)
    main = filename in ('index.html','en.html')
    assert page.h1==1
    assert len(page.ids)==len(set(page.ids)), 'Duplicate IDs'
    assert text.count('1965')==(1 if main else 0), 'Founding year must appear once outside the untouched logo'
    for phrase in ('זמינות מרמת השותף','CISO','צוות IT','סניף ראשי','רואי חשבון שתכירו בשם ובפנים','נתונים שאפשר לבדוק'):
        assert phrase not in text, phrase
    assert 'noindex,nofollow' in text
    if main:
        for s in services:
            assert f'id="service-{s["id"]}"' in text
    for link in page.links:
        if link.startswith(('http:','https:','mailto:','tel:')):continue
        path,_,fragment=link.partition('#')
        if path:
            target=(OUT/path.split('?')[0]).resolve()
            assert target.exists(), target
        elif fragment:
            assert fragment in page.ids, fragment
    if main:
        assert len(re.findall('type="submit" disabled name="channel"',text))==2
        assert 'class="hero-identity hero-entry"' in text
        assert len(re.findall(r'<img[^>]+src="../assets/logo-full.png"',text))==1, 'Logo must appear exactly once on each main page'
        assert 'assistant-variable.ttf' in text
        assert 'id="service-search"' in text
        assert 'id="no-services"' in text
        assert '../privacy.html' not in text and '../accessibility.html' not in text
        assert 'פרנק' not in text and 'FrankRuhl' not in text
assert 'provider:' not in (OUT/'studio.js').read_text()
for path, expected in json.loads((ROOT/'scripts/brand-integrity.json').read_text()).items():
    data=(ROOT/path).read_bytes()
    actual=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
    assert actual == expected, f'Protected original asset changed: {path}'
assert 'font-family:OfficeSans' in (OUT/'studio.css').read_text()
assert 'FrankRuhl' not in (OUT/'studio.css').read_text()
print('PASS: all HTML pages, 22 bilingual services, original logo/portraits, one founding year, excluded phrases, local links, font and no-JS form guards.')
