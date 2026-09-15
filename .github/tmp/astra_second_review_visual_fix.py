from pathlib import Path

p=Path('style400-cinematics.css')
s=p.read_text(encoding='utf-8')
marker='/* Astra second-review porch visibility correction. */'
if marker in s:
    raise SystemExit('porch visibility correction already present')
addition=r'''

/* Astra second-review porch visibility correction. */
.cin-porch-reconnect .porch-far-island{
  display:block!important;position:absolute!important;right:5%!important;top:14%!important;
  width:150px!important;height:116px!important;opacity:1!important;visibility:visible!important;
  z-index:6!important;filter:drop-shadow(0 10px 8px rgba(38,59,73,.2));animation:none!important;
}
.cin-porch-reconnect .porch-far-island .porch-island-side{
  display:block!important;position:absolute!important;left:14%!important;right:10%!important;top:37%!important;bottom:0!important;
  background-image:linear-gradient(112deg,rgba(255,244,212,.14),rgba(83,50,31,.22)),var(--cin-earth)!important;
  background-size:cover,70px 70px!important;clip-path:polygon(3% 0,97% 0,88% 40%,71% 72%,52% 100%,29% 74%,10% 40%)!important;
}
.cin-porch-reconnect .porch-far-island .porch-island-top{
  display:block!important;position:absolute!important;left:5%!important;right:4%!important;top:25%!important;height:39%!important;
  border-radius:50%!important;background-image:linear-gradient(180deg,rgba(239,255,228,.24),rgba(70,125,74,.12)),var(--cin-grass)!important;
  background-size:cover,70px 70px!important;box-shadow:inset 0 2px rgba(255,255,255,.34)!important;
}
.cin-porch-reconnect .porch-far-island .porch-tree{
  display:block!important;position:absolute!important;left:24px!important;top:17px!important;width:8px!important;height:35px!important;
  border-radius:5px!important;background:#73513a!important;z-index:8!important;
}
.cin-porch-reconnect .porch-far-island .porch-tree:before{
  content:"";position:absolute;left:-13px;top:-15px;width:34px;height:28px;border-radius:50%;
  background:radial-gradient(circle at 35% 25%,#b5dda4,#68a866 64%,#4e8554);box-shadow:9px 4px 0 -5px #79b46e;
}
.cin-porch-reconnect .porch-far-island .porch-house{
  display:block!important;position:absolute!important;z-index:9!important;left:58%!important;top:17%!important;translate:-50% 0!important;
  width:43px!important;height:34px!important;border-radius:5px 5px 2px 2px!important;
  background-image:linear-gradient(rgba(255,247,225,.14),rgba(75,43,24,.08)),var(--cin-wood)!important;background-size:cover,48px 48px!important;
  box-shadow:0 3px 4px rgba(53,39,29,.16)!important;
}
.cin-porch-reconnect .porch-far-island .porch-house:before{
  content:"";position:absolute;left:-6px;right:-6px;top:-15px;height:18px;background:#a96950;
  clip-path:polygon(50% 0,100% 72%,90% 100%,9% 100%,0 72%);
}
.cin-porch-reconnect .porch-far-island .porch-house:after{
  content:"";position:absolute;left:17px;bottom:0;width:10px;height:16px;border-radius:5px 5px 1px 1px;background:#684836;
}
.cin-porch-reconnect .porch-far-island .porch-deck{
  display:block!important;position:absolute!important;z-index:10!important;left:44%!important;top:48%!important;width:67px!important;height:8px!important;
  border-radius:2px;background:repeating-linear-gradient(90deg,#805b3e 0 7px,#b18256 7px 13px);box-shadow:0 3px 3px rgba(51,38,29,.18);
}
.cin-porch-reconnect .porch-far-island .porch-friend-lantern{
  display:block!important;position:absolute!important;z-index:12!important;top:40%!important;width:10px!important;height:12px!important;
  border-radius:4px;background:#ffd66b!important;border:2px solid #75543a!important;box-shadow:0 0 12px #ffe68b,0 2px 2px rgba(50,37,27,.2)!important;
}
.cin-porch-reconnect .porch-far-island .porch-friend-lantern.l1{left:46%!important}
.cin-porch-reconnect .porch-far-island .porch-friend-lantern.l2{right:8%!important}
.cin-porch-reconnect .porch-reconnect-line{left:22%!important;top:67%!important;width:58%!important;rotate:-23deg!important;z-index:5!important}
.cin-porch-reconnect .porch-route-pulse{left:auto!important;right:17%!important;top:36%!important;z-index:13!important}
@media(max-width:350px){
  .cin-porch-reconnect .porch-far-island{right:1%!important;top:16%!important;scale:.88!important;transform-origin:100% 0}
  .cin-porch-reconnect .porch-reconnect-line{width:61%!important;rotate:-22deg!important}
}
'''
p.write_text(s+addition,encoding='utf-8')
