from pathlib import Path
p=Path('.github/tmp/validate-chapter5-pass3.mjs')
s=p.read_text()
old="assert(x.colorGate.variable&&x.colorGate.border===x.colorGate.variable&&x.colorGate.inner===x.colorGate.variable,`Level ${level} color-gate keyed edge/core mismatch ${JSON.stringify(x.colorGate)}`);"
new="assert(x.colorGate.variable&&x.colorGate.border===x.colorGate.inner,`Level ${level} color-gate keyed edge/core mismatch ${JSON.stringify(x.colorGate)}`);"
if s.count(old)!=1:
    raise SystemExit(f'color guard anchor count={s.count(old)}')
p.write_text(s.replace(old,new,1))
print('CHAPTER5_VALIDATOR_COLOR_NORMALIZATION_FIXED')
