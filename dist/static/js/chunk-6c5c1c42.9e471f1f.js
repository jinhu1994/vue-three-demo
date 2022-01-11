(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c5c1c42"],{"113e":function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var r={isWebGLAvailable:function(){try{var e=document.createElement("canvas");return!(!window.WebGLRenderingContext||!e.getContext("webgl")&&!e.getContext("experimental-webgl"))}catch(t){return!1}},isWebGL2Available:function(){try{var e=document.createElement("canvas");return!(!window.WebGL2RenderingContext||!e.getContext("webgl2"))}catch(t){return!1}},getWebGLErrorMessage:function(){return this.getErrorMessage(1)},getWebGL2ErrorMessage:function(){return this.getErrorMessage(2)},getErrorMessage:function(e){var t={1:"WebGL",2:"WebGL 2"},n={1:window.WebGLRenderingContext,2:window.WebGL2RenderingContext},r='Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>',a=document.createElement("div");return a.id="webglmessage",a.style.fontFamily="monospace",a.style.fontSize="13px",a.style.fontWeight="normal",a.style.textAlign="center",a.style.background="#fff",a.style.color="#000",a.style.padding="1.5em",a.style.width="400px",a.style.margin="5em auto 0",r=n[e]?r.replace("$0","graphics card"):r.replace("$0","browser"),r=r.replace("$1",t[e]),a.innerHTML=r,a}}},8114:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"container"},[n("div",{staticClass:"page-des"},[e._v("WebGL高性能渲染，保持高帧数")]),n("div",{ref:"bufferGeometry",staticClass:"three-area"})])},a=[],i=(n("cfc3"),n("9a8c"),n("a975"),n("735e"),n("c1ac"),n("d139"),n("3a7b"),n("d5d6"),n("82f8"),n("e91f"),n("60bd"),n("5f96"),n("3280"),n("3fcc"),n("ca91"),n("25a1"),n("cd26"),n("3c5d"),n("2954"),n("649e"),n("219c"),n("170b"),n("b39a"),n("72f7"),n("d3b7"),n("ace4"),n("5a89")),l=n("113e"),o=n("ef20"),s={data:function(){return{renderer:null,stats:null,camera:null,scene:null,mesh:null}},mounted:function(){l["a"].isWebGLAvailable()&&(this.init(),this.render())},beforeDestroy:function(){this.camera&&(this.camera=null),this.scene&&(this.scene=null),this.renderer&&(this.renderer=null),this.mesh&&(this.mesh=null),this.stats&&(this.stats=null)},methods:{init:function(){var e=this,t=e.$refs.bufferGeometry;e.stats=new o["a"],e.stats.domElement.style.position="absolute",e.stats.domElement.style.top="50px",e.stats.showPanel(1),t.appendChild(this.stats.domElement),e.camera=new i["J"](27,t.clientWidth/t.clientHeight,5,3500),e.camera.position.z=2750,e.scene=new i["O"],e.scene.fog=new i["p"](328965,2e3,3500);for(var n=5e5,r=new i["f"],a=new Float32Array(3*n),l=new Float32Array(3*n),s=new i["h"],c=800,d=c/2,f=0;f<a.length;f+=3){var u=Math.random()*c-d,m=Math.random()*c-d,h=Math.random()*c-d;a[f]=u,a[f+1]=m,a[f+2]=h;var p=u/c+.5,g=m/c+.5,w=h/c+.5;s.setRGB(p,g,w),l[f]=s.r,l[f+1]=s.g,l[f+2]=s.b}r.setAttribute("position",new i["e"](a,3)),r.setAttribute("color",new i["e"](l,3)),r.computeBoundingSphere();var b=new i["M"]({size:8,vertexColors:i["W"]});e.mesh=new i["L"](r,b),e.scene.add(e.mesh),e.renderer=new i["X"]({antialias:!0}),e.renderer.setClearColor(e.scene.fog.color),e.renderer.setPixelRatio(window.devicePixelRatio),e.renderer.setSize(t.clientWidth,t.clientHeight),t.appendChild(e.renderer.domElement)},render:function(){var e=this;e.stats.begin(),e.renderer.clear(),e.renderer.render(e.scene,e.camera),e.mesh&&(e.mesh.rotation.x+=.005,e.mesh.rotation.y+=.01),e.stats.end(),requestAnimationFrame(e.render)}}},c=s,d=n("2877"),f=Object(d["a"])(c,r,a,!1,null,null,null);t["default"]=f.exports},ef20:function(e,t,n){"use strict";var r=function(){var e=0,t=document.createElement("div");function n(e){return t.appendChild(e.dom),e}function a(n){for(var r=0;r<t.children.length;r++)t.children[r].style.display=r===n?"block":"none";e=n}t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",(function(n){n.preventDefault(),a(++e%t.children.length)}),!1);var i=(performance||Date).now(),l=i,o=0,s=n(new r.Panel("FPS","#0ff","#002")),c=n(new r.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var d=n(new r.Panel("MB","#f08","#201"));return a(0),{REVISION:16,dom:t,addPanel:n,showPanel:a,begin:function(){i=(performance||Date).now()},end:function(){o++;var e=(performance||Date).now();if(c.update(e-i,200),e>=l+1e3&&(s.update(1e3*o/(e-l),100),l=e,o=0,d)){var t=performance.memory;d.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){i=this.end()},domElement:t,setMode:a}};r.Panel=function(e,t,n){var r=1/0,a=0,i=Math.round,l=i(window.devicePixelRatio||1),o=80*l,s=48*l,c=3*l,d=2*l,f=3*l,u=15*l,m=74*l,h=30*l,p=document.createElement("canvas");p.width=o,p.height=s,p.style.cssText="width:80px;height:48px";var g=p.getContext("2d");return g.font="bold "+9*l+"px Helvetica,Arial,sans-serif",g.textBaseline="top",g.fillStyle=n,g.fillRect(0,0,o,s),g.fillStyle=t,g.fillText(e,c,d),g.fillRect(f,u,m,h),g.fillStyle=n,g.globalAlpha=.9,g.fillRect(f,u,m,h),{dom:p,update:function(s,w){r=Math.min(r,s),a=Math.max(a,s),g.fillStyle=n,g.globalAlpha=1,g.fillRect(0,0,o,u),g.fillStyle=t,g.fillText(i(s)+" "+e+" ("+i(r)+"-"+i(a)+")",c,d),g.drawImage(p,f+l,u,m-l,h,f,u,m-l,h),g.fillRect(f+m-l,u,l,h),g.fillStyle=n,g.globalAlpha=.9,g.fillRect(f+m-l,u,l,i((1-s/w)*h))}}},t["a"]=r}}]);