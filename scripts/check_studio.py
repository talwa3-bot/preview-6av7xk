"""Content and release guards for explicit client requirements."""
import json
import re
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
assert len(services)==20
assert len({s['id'] for s in services})==len(services)
for s in services:
    for field in ('title','department','intro','output','clients'):
        assert len(s[field])==2 and all(s[field]), (s['id'],field)
    assert all(len(items)==3 for items in s['items'])
for filename in ('index.html','en.html'):
    text=(OUT/filename).read_text();page=Page(text)
    assert page.h1==1
    assert len(page.ids)==len(set(page.ids)), 'Duplicate IDs'
    assert text.count('1965')==1, 'Founding year must appear once outside the untouched logo'
    for phrase in ('זמינות מרמת השותף','CISO','צוות IT','סניף ראשי','רואי חשבון שתכירו בשם ובפנים','נתונים שאפשר לבדוק'):
        assert phrase not in text, phrase
    assert 'noindex,nofollow' in text
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
    assert len(re.findall('type="submit" disabled name="channel"',text))==2
assert 'provider:' not in (OUT/'studio.js').read_text()
print('PASS: 20 complete bilingual services; one founding year; excluded phrases; IDs, assets and links; safe no-JS form state.')
