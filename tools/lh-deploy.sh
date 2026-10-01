#!/usr/bin/env bash
# Lighthouse mobile com cabeçalhos de deploy simulados (tools/serve.mjs): bash tools/lh-deploy.sh <saida.json>
cd "$(dirname "$0")/.."
node tools/serve.mjs 8766 >/dev/null 2>&1 & SRV=$!; sleep 1
CHROME_PATH=$(node -e "console.log(require('playwright').chromium.executablePath())") \
  npx -y lighthouse@12 http://localhost:8766/ --form-factor=mobile --quiet \
  --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$1" >/dev/null 2>&1
kill $SRV 2>/dev/null
python -c "
import json,sys
d=json.load(open(sys.argv[1],encoding='utf-8')); a=d['audits']
c={k:round(v['score']*100) for k,v in d['categories'].items()}
print('perf',c['performance'],'a11y',c['accessibility'],'bp',c['best-practices'],'seo',c['seo'],'| FCP',a['first-contentful-paint']['displayValue'],'LCP',a['largest-contentful-paint']['displayValue'],'TBT',a['total-blocking-time']['displayValue'],'CLS',a['cumulative-layout-shift']['displayValue'],'SI',a['speed-index']['displayValue'])
" "$1"
