import{s as H,o as L,b as W}from"../chunks/scheduler.e108d1fd.js";import{S as Y,i as J,g as _,s as M,m as P,r as K,h as v,y as j,c as I,j as T,f as c,n as N,u as O,z as Q,k as q,a as V,x as r,v as X,o as F,d as Z,t as ee,w as te}from"../chunks/index.a864fe6f.js";import{S as ne,N as oe,M as t}from"../chunks/neat.781449ad.js";function se(g){let d,E="NEAT Demo: Pole Balancing",h,o,m,x,n,s,$,y,p=g[1].generation+"",B,b,a,l,w,R,f,C,u,D=`body {
      max-width: unset;
    }
  `,k;return f=new ne({props:{neat:g[1]}}),{c(){d=_("h1"),d.textContent=E,h=M(),o=_("div"),m=_("div"),x=_("div"),n=M(),s=_("p"),$=P("Generation: "),y=_("b"),B=P(p),b=_("br"),a=P("Species: "),l=_("b"),w=P(g[2]),R=M(),K(f.$$.fragment),C=M(),u=_("style"),u.textContent=D,this.h()},l(e){d=v(e,"H1",{class:!0,"data-svelte-h":!0}),j(d)!=="svelte-14milue"&&(d.textContent=E),h=I(e),o=v(e,"DIV",{class:!0});var i=T(o);m=v(i,"DIV",{class:!0});var S=T(m);x=v(S,"DIV",{}),T(x).forEach(c),n=I(S),s=v(S,"P",{});var A=T(s);$=N(A,"Generation: "),y=v(A,"B",{});var z=T(y);B=N(z,p),z.forEach(c),b=v(A,"BR",{}),a=N(A,"Species: "),l=v(A,"B",{});var G=T(l);w=N(G,g[2]),G.forEach(c),A.forEach(c),S.forEach(c),R=I(i),O(f.$$.fragment,i),i.forEach(c),C=I(e);const U=Q("svelte-1nzwmq1",document.head);u=v(U,"STYLE",{"data-svelte-h":!0}),j(u)!=="svelte-1uct9xx"&&(u.textContent=D),U.forEach(c),this.h()},h(){q(d,"class","svelte-4s2i8h"),q(m,"class","view svelte-4s2i8h"),q(o,"class","flex svelte-4s2i8h"),document.title="NEAT Demo: Pole Balancing"},m(e,i){V(e,d,i),V(e,h,i),V(e,o,i),r(o,m),r(m,x),g[3](x),r(m,n),r(m,s),r(s,$),r(s,y),r(y,B),r(s,b),r(s,a),r(s,l),r(l,w),r(o,R),X(f,o,null),V(e,C,i),r(document.head,u),k=!0},p(e,[i]){(!k||i&2)&&p!==(p=e[1].generation+"")&&F(B,p),(!k||i&4)&&F(w,e[2]);const S={};i&2&&(S.neat=e[1]),f.$set(S)},i(e){k||(Z(f.$$.fragment,e),k=!0)},o(e){ee(f.$$.fragment,e),k=!1},d(e){e&&(c(d),c(h),c(o),c(C)),g[3](null),te(f),c(u)}}}function ae(g,d,E){let h,o=new oe(4,30,[2,4,1]),m="";L(async()=>{const n=t.Engine.create();n.timing.timeScale=1;const s=t.Render.create({element:h,engine:n,options:{width:800,height:600,showAngleIndicator:!1,wireframes:!1}});s.context.textAlign="center",t.Render.run(s);const $=t.Runner.create();t.Runner.run($,n),t.Render.lookAt(s,{min:{x:0,y:0},max:{x:800,y:600}}),t.Composite.add(n.world,[t.Bodies.rectangle(400,600,800,50,{isStatic:!0})]);const y={group:-1,mask:1,category:2};for(;;)await o.compete(p=>new Promise(B=>{const b={strokeStyle:"#ffffff",lineWidth:3,fillStyle:"#"+(16777216*Math.random()|0).toString(16).padStart(6,"0"),opacity:.4},a=t.Bodies.rectangle(400,570,20,20,{render:b,collisionFilter:y,friction:0,frictionStatic:0}),l=t.Bodies.circle(400,500,5,{render:b,collisionFilter:y}),w=t.Constraint.create({bodyA:a,bodyB:l,render:b});t.Composite.add(n.world,[a,l,w]),t.Body.translate(l,{x:(Math.random()-.5)*2,y:0});const R=performance.now(),f=()=>{t.Composite.remove(n.world,[a,l,w]),t.Events.off(n,"beforeUpdate",u),clearTimeout(C),B(performance.now()-R)},C=setTimeout(f,10*1e3),u=()=>{s.context.fillText(p.name,a.position.x,a.position.y+20);const D=p.network.evaluate([a.position.x/800,l.position.x/800])[0];t.Body.translate(a,{x:800*(D-.5),y:0}),(l.position.y>=a.position.y||a.position.x<=0||a.position.x>=800)&&f()};t.Events.on(n,"beforeUpdate",u)}),p=>{E(2,m=p.name)}),E(1,o),o.breed()});function x(n){W[n?"unshift":"push"](()=>{h=n,E(0,h)})}return[h,o,m,x]}class ce extends Y{constructor(d){super(),J(this,d,ae,se,H,{})}}export{ce as component};
