from pathlib import Path
import re
p=Path('title-island-concepts/index.html')
t=p.read_text()
start='#c2 .little-home-tree .foliage{'
end='@keyframes littleHomeCanopy'
si=t.find(start)
ei=t.find(end,si)
if si<0 or ei<0:
    raise SystemExit('Current organic canopy block not found')
new=r'''#c2 .little-home-tree .foliage{position:absolute;left:1px;top:0;width:110px;height:87px;z-index:4;transform-origin:53px 78px;animation:littleHomeCanopy 7.8s ease-in-out infinite;filter:drop-shadow(0 4px 5px rgba(42,77,50,.14))}
#c2 .little-home-tree .foliage:before{content:"";position:absolute;inset:0;clip-path:polygon(5% 50%,8% 34%,19% 23%,28% 21%,34% 8%,48% 1%,60% 8%,73% 5%,87% 15%,93% 29%,100% 42%,96% 57%,86% 63%,79% 76%,64% 80%,52% 91%,38% 84%,24% 87%,17% 73%,7% 66%);background-image:radial-gradient(ellipse at 30% 18%,rgba(238,255,219,.38),transparent 30%),linear-gradient(155deg,rgba(166,217,143,.40),rgba(60,126,68,.28) 62%,rgba(32,83,47,.38)),url('textures/grass.jpg');background-size:cover,cover,58px 58px;background-position:center;background-blend-mode:screen,multiply,soft-light;box-shadow:inset -12px -10px 16px rgba(27,77,40,.22),inset 7px 5px 10px rgba(238,255,220,.15)}
#c2 .little-home-tree .foliage:after{content:"";position:absolute;inset:8px 9px 7px 8px;clip-path:polygon(3% 47%,11% 27%,27% 18%,35% 2%,53% 7%,67% 1%,86% 19%,96% 39%,90% 59%,78% 67%,68% 86%,48% 82%,34% 94%,20% 80%,7% 68%);background:radial-gradient(circle at 22% 28%,rgba(226,251,203,.30) 0 8%,transparent 9%),radial-gradient(circle at 58% 22%,rgba(226,251,203,.23) 0 7%,transparent 8%),radial-gradient(circle at 72% 58%,rgba(25,82,42,.16) 0 9%,transparent 10%),radial-gradient(circle at 34% 67%,rgba(25,82,42,.14) 0 10%,transparent 11%);opacity:.78;mix-blend-mode:soft-light}
#c2 .little-home-tree .leaf-cluster{position:absolute;display:block;border:0;box-shadow:none;opacity:.48;mix-blend-mode:soft-light;background:linear-gradient(145deg,rgba(224,249,202,.55),rgba(38,95,50,.34));filter:none}
#c2 .little-home-tree .leaf-a{left:17px;top:17px;width:37px;height:25px;clip-path:polygon(0 42%,20% 3%,71% 0,100% 44%,78% 100%,25% 89%);transform:rotate(-8deg)}
#c2 .little-home-tree .leaf-b{left:4px;top:38px;width:40px;height:27px;clip-path:polygon(0 35%,24% 0,82% 13%,100% 57%,66% 100%,14% 84%);transform:rotate(8deg)}
#c2 .little-home-tree .leaf-c{left:66px;top:18px;width:37px;height:29px;clip-path:polygon(8% 10%,63% 0,100% 35%,82% 89%,35% 100%,0 57%);transform:rotate(12deg)}
#c2 .little-home-tree .leaf-d{left:28px;top:47px;width:39px;height:28px;clip-path:polygon(0 31%,32% 0,85% 9%,100% 58%,69% 100%,19% 87%);transform:rotate(-10deg)}
#c2 .little-home-tree .leaf-e{left:59px;top:48px;width:34px;height:25px;clip-path:polygon(10% 0,76% 6%,100% 49%,70% 100%,17% 87%,0 39%);transform:rotate(5deg);opacity:.34}
#c2 .little-home-tree .leaf-f{left:28px;top:6px;width:33px;height:22px;clip-path:polygon(3% 51%,23% 4%,72% 0,100% 40%,74% 100%,18% 89%);transform:rotate(-14deg);opacity:.36}
#c2 .little-home-tree .leaf-g{left:72px;top:8px;width:28px;height:22px;clip-path:polygon(0 36%,29% 0,82% 12%,100% 64%,57% 100%,11% 77%);transform:rotate(16deg);opacity:.32}
'''
t=t[:si]+new+t[ei:]
p.write_text(t)
