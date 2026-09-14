from pathlib import Path

index_path = Path('index.html')
css_path = Path('style400-ui.css')
index = index_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

old_open = '<div class="ending-homecoming" role="img" aria-label="Little Home connected to the living Skyway while ordinary morning routes continue">'
new_open = '''<div class="ending-homecoming ending-network-stage" role="img" aria-label="Living Skyway routes connect several communities before drawing toward Little Home, where a parcel reaches the porch while the islands keep drifting.">
        <div class="ending-network-field" aria-hidden="true">
          <span class="ending-skyway-node node-meadows" data-region="Sunpetal Meadows"><i></i><b>Meadows</b></span>
          <span class="ending-skyway-node node-lantern" data-region="Lanternwood Grove"><i></i><b>Lanternwood</b></span>
          <span class="ending-skyway-node node-lodestone" data-region="Lodestone Caverns"><i></i><b>Lodestone</b></span>
          <span class="ending-skyway-node node-copper" data-region="Copperline Works"><i></i><b>Copperline</b></span>
          <span class="ending-skyway-node node-storm" data-region="Stormswitch Reach"><i></i><b>Stormswitch</b></span>
          <span class="ending-skyway-node node-home" data-region="Little Home" data-home-node="true"><i></i><b>Little Home</b></span>
          <i class="ending-network-link link-a"></i><i class="ending-network-link link-b"></i><i class="ending-network-link link-c"></i>
          <i class="ending-network-link link-d"></i><i class="ending-network-link link-e"></i><i class="ending-network-link link-f"></i>
        </div>
        <div class="ending-home-focus">'''
assert old_open in index, 'ending homecoming opening anchor changed'
index = index.replace(old_open, new_open, 1)

old_routes = '<div class="ending-living-routes" aria-hidden="true"><i class="route-a"></i><i class="route-b"></i><i class="route-c"></i><span class="ending-parcel">✉</span><span class="ending-porch-light"></span></div>'
new_routes = old_routes + '\n        </div>'
assert old_routes in index, 'ending living routes anchor changed'
index = index.replace(old_routes, new_routes, 1)

marker = '/* Astra ending closure: living Skyway to Little Home */'
assert marker not in css, 'ending closure CSS already present'
css += r'''

/* Astra ending closure: living Skyway to Little Home */
.ending-network-stage{background:radial-gradient(circle at 50% 56%,rgba(255,249,214,.46),transparent 29%),linear-gradient(180deg,#a9d6f2 0%,#dcecf3 60%,#f2eee0 100%)}
.ending-network-field{position:absolute;inset:0;z-index:1;opacity:.52;transform:scale(1.06);transform-origin:50% 56%;animation:endingNetworkWide 5.8s cubic-bezier(.2,.72,.22,1) 1 both;pointer-events:none}
.ending-home-focus{position:absolute;inset:7% 6% 4%;z-index:2;border-radius:22px;overflow:hidden;opacity:1;transform:scale(1);transform-origin:50% 58%;box-shadow:0 10px 28px rgba(41,70,92,.16),0 0 0 1px rgba(255,255,255,.46);animation:endingNetworkHomeward 5.8s cubic-bezier(.18,.74,.2,1) 1 both}
.ending-home-focus .ending-home-frame{inset:-10% -7% -16%;width:114%;height:128%}
.ending-home-focus .ending-living-routes{z-index:4}
.ending-skyway-node{position:absolute;width:42px;height:22px;border-radius:50%;background:linear-gradient(180deg,#9edb80 0 37%,#9a704e 40% 72%,#6b4c3d 74% 100%);box-shadow:0 5px 10px rgba(41,65,83,.18),inset 0 2px rgba(255,255,255,.24);transform:translate(-50%,-50%)}
.ending-skyway-node i{position:absolute;left:50%;top:-8px;width:11px;height:14px;translate:-50% 0;border-radius:5px 5px 2px 2px;background:#fff1d8;border:1px solid rgba(128,96,58,.32);box-shadow:0 2px 3px rgba(55,72,82,.12)}
.ending-skyway-node i:before{content:"";position:absolute;left:-2px;right:-2px;top:-5px;height:7px;background:#d66f56;clip-path:polygon(50% 0,100% 78%,86% 100%,14% 100%,0 78%)}
.ending-skyway-node b{position:absolute;left:50%;top:27px;translate:-50% 0;white-space:nowrap;padding:2px 5px;border-radius:999px;background:rgba(255,250,236,.88);color:#365a78;font-size:8px;line-height:1.1;letter-spacing:.01em;box-shadow:0 2px 5px rgba(36,64,84,.08)}
.ending-skyway-node.node-home{width:48px;height:25px;box-shadow:0 0 0 3px rgba(255,235,143,.6),0 7px 14px rgba(41,65,83,.2)}
.node-meadows{left:13%;top:22%}.node-lantern{left:82%;top:23%}.node-lodestone{left:9%;top:54%}.node-copper{left:90%;top:53%}.node-storm{left:25%;top:79%}.node-home{left:53%;top:66%}
.ending-network-link{position:absolute;height:3px;border-radius:999px;background:linear-gradient(90deg,rgba(87,176,238,.05),rgba(87,176,238,.9) 20%,#fff1a5 50%,rgba(87,176,238,.9) 80%,rgba(87,176,238,.05));box-shadow:0 0 8px rgba(75,166,232,.55);transform-origin:left center;opacity:.78}
.ending-network-link.link-a{left:16%;top:27%;width:150px;rotate:2deg}.ending-network-link.link-b{left:14%;top:51%;width:142px;rotate:-13deg}.ending-network-link.link-c{left:56%;top:29%;width:118px;rotate:14deg}.ending-network-link.link-d{left:56%;top:58%;width:132px;rotate:-10deg}.ending-network-link.link-e{left:28%;top:74%;width:104px;rotate:-13deg}.ending-network-link.link-f{left:52%;top:67%;width:114px;rotate:18deg}
.ending-network-stage .ending-living-routes i{animation:endingPass4Route 3.2s ease-in-out 2.35s 1 both}
.ending-network-stage .ending-parcel{animation:endingPass4Parcel 5.2s ease-in-out 2.15s 1 both}
.ending-network-stage .ending-porch-light{animation:endingPass4Porch 2.7s ease-in-out 4.35s 1 both}
@keyframes endingNetworkWide{0%,25%{opacity:1;transform:scale(.94)}58%{opacity:.78}100%{opacity:.52;transform:scale(1.06)}}
@keyframes endingNetworkHomeward{0%,18%{opacity:.28;transform:scale(.48) translateY(7%)}42%{opacity:.72;transform:scale(.67) translateY(3%)}72%{opacity:1;transform:scale(.92) translateY(0)}100%{opacity:1;transform:scale(1) translateY(0)}}
@media(max-height:640px){
  .ending-hero-pass4 h1{font-size:31px;line-height:1;letter-spacing:-1px;white-space:nowrap;margin-top:2px;margin-bottom:3px}
  .ending-kicker{margin-top:6px}
  .ending-homecoming{height:190px;margin-bottom:5px}
  .ending-network-stage .ending-skyway-node b{display:none}
  .ending-home-focus{inset:6% 5% 3%}
  .ending-skyway-node{scale:.86}
  .ending-skyway-node.node-home{scale:.9}
}
@media(max-height:600px){
  .screen#complete{padding-top:6px;padding-bottom:6px}
  #complete .home-main{padding:0;gap:0;justify-content:flex-start}
  .ending-hero-pass4{padding:7px 10px 9px;border-radius:22px}
  .ending-hero-pass4>.logo{display:none}
  .ending-kicker{margin-top:0;font-size:9px;line-height:1.1}
  .ending-hero-pass4 h1{font-size:28px;margin:2px 0}
  .ending-hero-pass4>p:not(.ending-note){font-size:11.5px;line-height:1.25;margin-bottom:4px;max-width:290px}
  .ending-homecoming{height:140px;margin:0 auto 3px;border-radius:20px}
  .ending-home-focus{inset:4% 4% 2%;border-radius:16px}
  .ending-skyway-node{scale:.72}
  .ending-skyway-node.node-home{scale:.76}
  .ending-note{font-size:12px!important;line-height:1.15;margin:0 auto 5px!important}
  .ending-actions{gap:5px}
}
@media(prefers-reduced-motion:reduce){.ending-network-field,.ending-home-focus{animation:none!important}.ending-network-field{opacity:.52!important;transform:scale(1.06)!important}.ending-home-focus{opacity:1!important;transform:scale(1)!important}}
html[data-motion="reduced"] .ending-network-field,html[data-motion="reduced"] .ending-home-focus{animation:none!important;transition:none!important}
html[data-motion="reduced"] .ending-network-field{opacity:.52!important;transform:scale(1.06)!important}
html[data-motion="reduced"] .ending-home-focus{opacity:1!important;transform:scale(1)!important}
'''

index_path.write_text(index, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
print('Astra ending closure candidate applied.')