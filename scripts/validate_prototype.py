from html.parser import HTMLParser
from pathlib import Path
import re, subprocess, tempfile
p=Path('endopima/index.html'); text=p.read_text(encoding='utf-8')
class Check(HTMLParser):
 def __init__(self): super().__init__(); self.ids=set(); self.duplicates=[]; self.lang=False
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if tag=='html': self.lang=bool(a.get('lang'))
  if 'id' in a:
   if a['id'] in self.ids:self.duplicates.append(a['id'])
   self.ids.add(a['id'])
c=Check();c.feed(text)
assert c.lang, 'html lang is required'; assert not c.duplicates, f'duplicate ids: {c.duplicates}'
assert 'not a diagnosis' in text.lower(), 'medical scope warning missing'
assert 'DEMONSTRATION DATA' in text, 'demonstration-data labels missing'
scripts=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',text,re.S)
for i,script in enumerate(scripts):
 if not script.strip():continue
 with tempfile.NamedTemporaryFile('w',suffix='.js') as f:
  f.write(script);f.flush();subprocess.run(['node','--check',f.name],check=True)
print(f'validated HTML, {len(c.ids)} unique ids and {len(scripts)} script blocks')
