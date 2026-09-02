from pathlib import Path
import re

p=Path('title-island-concepts/index.html')
t=p.read_text()

c2_start='<section class="concept" id="c2"'
c3_start='<section class="concept" id="c3"'
if c2_start not in t or c3_start not in t:
    raise SystemExit('Concept boundaries not found')
pre, rest=t.split(c2_start,1)
c2, post=rest.split(c3_start,1)
old_tree='<div class="tree"><div class="trunk"></div><div class="crown one"></div><div class="crown two"></div><div class="crown three"></div></div>'
new_tree='''<div class="tree little-home-tree"><div class="tree-ground-shadow"></div><i class="root root-a"></i><i class="root root-b"></i><i class="root root-c"></i><div class="trunk"></div><i class="branch branch-a"></i><i class="branch branch-b"></i><i class="branch branch-c"></i><div class="foliage"><i class="leaf-cluster leaf-a"></i><i class="leaf-cluster leaf-b"></i><i class="leaf-cluster leaf-c"></i><i class="leaf-cluster leaf-d"></i><i class="leaf-cluster leaf-e"></i><i class="leaf-cluster leaf-f"></i><i class="leaf-cluster leaf-g"></i></div></div>'''
if old_tree not in c2:
    raise SystemExit('Expected old Concept 2 tree markup not found')
c2=c2.replace(old_tree,new_tree,1)
t=pre+c2_start+c2+c3_start+post

old_rule_re=r'#c2 \.tree\{left:35px;top:30px;transform:scale\(\.9\)\}'
if not re.search(old_rule_re,t):
    raise SystemExit('Expected Concept 2 tree placement rule not found')
new_css=r'''#c2 .tree{left:27px;top:15px;width:112px;height:128px;transform:none}
/* Little Home organic textured tree */
#c2 .little-home-tree{filter:drop-shadow(0 8px 7px rgba(43,64,50,.16));transform-origin:54px 112px}
#c2 .little-home-tree .tree-ground-shadow{position:absolute;left:29px;bottom:2px;width:65px;height:14px;border-radius:50%;background:rgba(42,71,48,.18);filter:blur(4px);z-index:0}
#c2 .little-home-tree .trunk{left:47px;bottom:10px;width:21px;height:69px;border-radius:47% 53% 31% 38% / 18% 20% 16% 18%;clip-path:polygon(34% 0,74% 3%,84% 28%,76% 56%,100% 100%,0 100%,20% 57%,16% 30%);background-image:linear-gradient(90deg,rgba(255,255,255,.20),transparent 33%,rgba(54,31,17,.18) 78%),url('textures/wood.jpg');background-size:cover,58px 72px;background-position:center;box-shadow:inset -4px 0 5px rgba(53,31,18,.18),inset 3px 0 4px rgba(255,238,205,.10);z-index:3}
#c2 .little-home-tree .branch{position:absolute;z-index:2;display:block;width:10px;height:47px;border-radius:8px;transform-origin:50% 100%;background-image:linear-gradient(90deg,rgba(255,255,255,.16),rgba(52,31,19,.16)),url('textures/wood.jpg');background-size:cover,48px 62px;box-shadow:inset -2px 0 3px rgba(48,29,17,.15)}
#c2 .little-home-tree .branch-a{left:50px;bottom:55px;height:45px;transform:rotate(-39deg)}#c2 .little-home-tree .branch-b{left:58px;bottom:58px;height:48px;transform:rotate(35deg)}#c2 .little-home-tree .branch-c{left:55px;bottom:67px;width:8px;height:39px;transform:rotate(4deg)}
#c2 .little-home-tree .root{position:absolute;bottom:9px;z-index:2;display:block;width:34px;height:9px;border-radius:70% 30% 70% 30%;background-image:linear-gradient(180deg,rgba(255,255,255,.12),rgba(53,31,17,.18)),url('textures/wood.jpg');background-size:cover,50px 45px;transform-origin:left center;box-shadow:0 2px 2px rgba(51,42,31,.09)}
#c2 .little-home-tree .root-a{left:52px;transform:rotate(11deg)}#c2 .little-home-tree .root-b{left:48px;transform:rotate(162deg) scaleX(.82)}#c2 .little-home-tree .root-c{left:53px;bottom:12px;transform:rotate(-29deg) scaleX(.67)}
#c2 .little-home-tree .foliage{position:absolute;left:1px;top:0;width:110px;height:87px;z-index:4;transform-origin:53px 78px;animation:littleHomeCanopy 7.8s ease-in-out infinite}
#c2 .little-home-tree .leaf-cluster{position:absolute;display:block;background-image:radial-gradient(circle at 29% 20%,rgba(238,255,220,.46),transparent 27%),linear-gradient(155deg,rgba(174,222,151,.48),rgba(60,126,68,.25) 63%,rgba(34,88,49,.36)),url('textures/grass.jpg');background-size:cover,cover,62px 62px;background-position:center;background-blend-mode:screen,multiply,soft-light;box-shadow:inset -7px -9px 12px rgba(28,81,43,.18),inset 4px 3px 7px rgba(236,255,219,.15),0 4px 6px rgba(42,77,50,.11);border:1px solid rgba(232,255,217,.16)}
#c2 .little-home-tree .leaf-a{left:29px;top:0;width:50px;height:47px;border-radius:58% 42% 54% 46% / 47% 57% 43% 53%;transform:rotate(-8deg)}
#c2 .little-home-tree .leaf-b{left:3px;top:24px;width:53px;height:43px;border-radius:61% 39% 45% 55% / 54% 45% 55% 46%;transform:rotate(9deg)}
#c2 .little-home-tree .leaf-c{left:57px;top:19px;width:51px;height:46px;border-radius:42% 58% 64% 36% / 52% 43% 57% 48%;transform:rotate(13deg)}
#c2 .little-home-tree .leaf-d{left:21px;top:39px;width:52px;height:45px;border-radius:45% 55% 43% 57% / 61% 42% 58% 39%;transform:rotate(-14deg)}
#c2 .little-home-tree .leaf-e{left:49px;top:42px;width:48px;height:41px;border-radius:59% 41% 55% 45% / 43% 60% 40% 57%;transform:rotate(7deg);filter:brightness(.91)}
#c2 .little-home-tree .leaf-f{left:15px;top:9px;width:42px;height:39px;border-radius:48% 52% 39% 61% / 58% 39% 61% 42%;transform:rotate(-19deg);filter:brightness(1.06)}
#c2 .little-home-tree .leaf-g{left:69px;top:4px;width:39px;height:38px;border-radius:62% 38% 48% 52% / 41% 58% 42% 59%;transform:rotate(18deg);filter:brightness(.98)}
@keyframes littleHomeCanopy{0%,100%{transform:rotate(-.7deg) translateY(0)}50%{transform:rotate(.8deg) translateY(-1px)}}'''
t=re.sub(old_rule_re,new_css,t,count=1)

p.write_text(t)
