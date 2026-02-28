if (!self.define) {
  let e,
    a = {}
  const i = (i, s) => (
    (i = new URL(i + '.js', s).href),
    a[i] ||
      new Promise(a => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;((e.src = i), (e.onload = a), document.head.appendChild(e))
        } else ((e = i), importScripts(i), a())
      }).then(() => {
        let e = a[i]
        if (!e) throw new Error(`Module ${i} didn’t register its module`)
        return e
      })
  )
  self.define = (s, t) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (a[c]) return
    let n = {}
    const r = e => i(e, c),
      d = { module: { uri: c }, exports: n, require: r }
    a[c] = Promise.all(s.map(e => d[e] || r(e))).then(e => (t(...e), n))
  }
}
define(['./workbox-1bb06f5e'], function (e) {
  'use strict'
  ;(importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: '35b1246d168ea0d90d5e326d35982430'
        },
        {
          url: '/_next/static/-SKA_h-c88MwE1wa1dmA_/_buildManifest.js',
          revision: '1f377c69eb81073cabba3c37fd9fd2ba'
        },
        {
          url: '/_next/static/-SKA_h-c88MwE1wa1dmA_/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933'
        },
        {
          url: '/_next/static/chunks/1255-8befde0980f5cba9.js',
          revision: '8befde0980f5cba9'
        },
        {
          url: '/_next/static/chunks/1330-9fed61dc88dd4297.js',
          revision: '9fed61dc88dd4297'
        },
        {
          url: '/_next/static/chunks/1646.a93085a0445ba909.js',
          revision: 'a93085a0445ba909'
        },
        {
          url: '/_next/static/chunks/164f4fb6-be29149f835688fc.js',
          revision: 'be29149f835688fc'
        },
        {
          url: '/_next/static/chunks/1905-9345c4c06a34abe1.js',
          revision: '9345c4c06a34abe1'
        },
        {
          url: '/_next/static/chunks/2457-39c53278c4642104.js',
          revision: '39c53278c4642104'
        },
        {
          url: '/_next/static/chunks/2619-04bc32f026a0d946.js',
          revision: '04bc32f026a0d946'
        },
        {
          url: '/_next/static/chunks/280273a7-6b496659f89996dc.js',
          revision: '6b496659f89996dc'
        },
        {
          url: '/_next/static/chunks/2931.4d2aa13ad3794b66.js',
          revision: '4d2aa13ad3794b66'
        },
        {
          url: '/_next/static/chunks/30a37ab2-696962fce233c7e3.js',
          revision: '696962fce233c7e3'
        },
        {
          url: '/_next/static/chunks/3233-076310aa7065fdb0.js',
          revision: '076310aa7065fdb0'
        },
        {
          url: '/_next/static/chunks/4199.85e31fc16c7b8626.js',
          revision: '85e31fc16c7b8626'
        },
        {
          url: '/_next/static/chunks/4230-bc148383e10f1c1b.js',
          revision: 'bc148383e10f1c1b'
        },
        {
          url: '/_next/static/chunks/4792-540a0f2b4f6fafb8.js',
          revision: '540a0f2b4f6fafb8'
        },
        {
          url: '/_next/static/chunks/4909-50b2c908998a76c5.js',
          revision: '50b2c908998a76c5'
        },
        {
          url: '/_next/static/chunks/4958-62189749d7965145.js',
          revision: '62189749d7965145'
        },
        {
          url: '/_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js',
          revision: '100b9d70ed4e49c1'
        },
        {
          url: '/_next/static/chunks/5052-10b098988ae88cfe.js',
          revision: '10b098988ae88cfe'
        },
        {
          url: '/_next/static/chunks/5139.e4ff9cc3669129ed.js',
          revision: 'e4ff9cc3669129ed'
        },
        {
          url: '/_next/static/chunks/6042-6ae381c53ab21e75.js',
          revision: '6ae381c53ab21e75'
        },
        {
          url: '/_next/static/chunks/6422-a7cac54d037e7cf2.js',
          revision: 'a7cac54d037e7cf2'
        },
        {
          url: '/_next/static/chunks/6759-12898a912faad7b1.js',
          revision: '12898a912faad7b1'
        },
        {
          url: '/_next/static/chunks/6793.84dc6ed1e8da9d1f.js',
          revision: '84dc6ed1e8da9d1f'
        },
        {
          url: '/_next/static/chunks/7167-904a78231c0e3e45.js',
          revision: '904a78231c0e3e45'
        },
        {
          url: '/_next/static/chunks/8187f03c-3ecb90f3ae975a54.js',
          revision: '3ecb90f3ae975a54'
        },
        {
          url: '/_next/static/chunks/8287-dd220b832672eb27.js',
          revision: 'dd220b832672eb27'
        },
        {
          url: '/_next/static/chunks/ad2866b8-e13a3cf75ccf0eb8.js',
          revision: 'e13a3cf75ccf0eb8'
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-c984c60fa49d6901.js',
          revision: 'c984c60fa49d6901'
        },
        {
          url: '/_next/static/chunks/app/about/page-c6b82188f7dc9c93.js',
          revision: 'c6b82188f7dc9c93'
        },
        {
          url: '/_next/static/chunks/app/api/advanced-search/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/chat/%5Bid%5D/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/chat/delete/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/chat/rename/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/chat/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/chats/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/config/models/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/connectors/%5Bprovider%5D/callback/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/connectors/create/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/connectors/delete/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/connectors/list/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/connectors/status/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/connectors/sync/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/enhance-prompt/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/ollama/models/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/api/upload/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/auth/confirm/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/auth/error/page-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/auth/forgot-password/page-e96f0f297b9f2edb.js',
          revision: 'e96f0f297b9f2edb'
        },
        {
          url: '/_next/static/chunks/app/auth/login/page-82187fd9a46fd5f1.js',
          revision: '82187fd9a46fd5f1'
        },
        {
          url: '/_next/static/chunks/app/auth/oauth/route-2670eed4d17a98b7.js',
          revision: '2670eed4d17a98b7'
        },
        {
          url: '/_next/static/chunks/app/auth/sign-up-success/page-c6b82188f7dc9c93.js',
          revision: 'c6b82188f7dc9c93'
        },
        {
          url: '/_next/static/chunks/app/auth/sign-up/page-4fe7cdc2cfafc8ff.js',
          revision: '4fe7cdc2cfafc8ff'
        },
        {
          url: '/_next/static/chunks/app/auth/update-password/page-cd8f3a8f4737c05b.js',
          revision: 'cd8f3a8f4737c05b'
        },
        {
          url: '/_next/static/chunks/app/connectors/page-392940df6f526492.js',
          revision: '392940df6f526492'
        },
        {
          url: '/_next/static/chunks/app/contact/page-9173e49aa5d22e40.js',
          revision: '9173e49aa5d22e40'
        },
        {
          url: '/_next/static/chunks/app/layout-aaac7ddbc41da4fe.js',
          revision: 'aaac7ddbc41da4fe'
        },
        {
          url: '/_next/static/chunks/app/page-87ed8e9f0f80dc58.js',
          revision: '87ed8e9f0f80dc58'
        },
        {
          url: '/_next/static/chunks/app/playbook/page-bd6b78d06f63d354.js',
          revision: 'bd6b78d06f63d354'
        },
        {
          url: '/_next/static/chunks/app/premium/page-8fe3591193d91f25.js',
          revision: '8fe3591193d91f25'
        },
        {
          url: '/_next/static/chunks/app/privacy/page-c6b82188f7dc9c93.js',
          revision: 'c6b82188f7dc9c93'
        },
        {
          url: '/_next/static/chunks/app/search/%5Bid%5D/loading-65c7747be10b558c.js',
          revision: '65c7747be10b558c'
        },
        {
          url: '/_next/static/chunks/app/search/%5Bid%5D/page-9ba9907daf735995.js',
          revision: '9ba9907daf735995'
        },
        {
          url: '/_next/static/chunks/app/search/loading-b1001f33c6273470.js',
          revision: 'b1001f33c6273470'
        },
        {
          url: '/_next/static/chunks/app/search/page-e24ecc457e04aff2.js',
          revision: 'e24ecc457e04aff2'
        },
        {
          url: '/_next/static/chunks/app/settings/page-82d70df2f75010bb.js',
          revision: '82d70df2f75010bb'
        },
        {
          url: '/_next/static/chunks/app/share/%5Bid%5D/page-65f93ef6d2d5ebcb.js',
          revision: '65f93ef6d2d5ebcb'
        },
        {
          url: '/_next/static/chunks/app/share/loading-68744ebab39acf58.js',
          revision: '68744ebab39acf58'
        },
        {
          url: '/_next/static/chunks/app/terms/page-c6b82188f7dc9c93.js',
          revision: 'c6b82188f7dc9c93'
        },
        {
          url: '/_next/static/chunks/bc98253f.d6fc8a0138855acd.js',
          revision: 'd6fc8a0138855acd'
        },
        {
          url: '/_next/static/chunks/d3ac728e-9eacce9606787270.js',
          revision: '9eacce9606787270'
        },
        {
          url: '/_next/static/chunks/framework-32492dd9c4fc5870.js',
          revision: '32492dd9c4fc5870'
        },
        {
          url: '/_next/static/chunks/main-app-3d32423710395eef.js',
          revision: '3d32423710395eef'
        },
        {
          url: '/_next/static/chunks/main-e4fba1c639cbd4dc.js',
          revision: 'e4fba1c639cbd4dc'
        },
        {
          url: '/_next/static/chunks/pages/_app-e8b861c87f6f033c.js',
          revision: 'e8b861c87f6f033c'
        },
        {
          url: '/_next/static/chunks/pages/_error-c8f84f7bd11d43d4.js',
          revision: 'c8f84f7bd11d43d4'
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f'
        },
        {
          url: '/_next/static/chunks/webpack-356c4770969a333b.js',
          revision: '356c4770969a333b'
        },
        {
          url: '/_next/static/css/09dfadb69bdaa005.css',
          revision: '09dfadb69bdaa005'
        },
        {
          url: '/_next/static/css/7d9dd640dc5eb0a0.css',
          revision: '7d9dd640dc5eb0a0'
        },
        {
          url: '/_next/static/css/dab9058ffd4aff42.css',
          revision: 'dab9058ffd4aff42'
        },
        {
          url: '/_next/static/media/KaTeX_AMS-Regular.1608a09b.woff',
          revision: '1608a09b'
        },
        {
          url: '/_next/static/media/KaTeX_AMS-Regular.4aafdb68.ttf',
          revision: '4aafdb68'
        },
        {
          url: '/_next/static/media/KaTeX_AMS-Regular.a79f1c31.woff2',
          revision: 'a79f1c31'
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Bold.b6770918.woff',
          revision: 'b6770918'
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Bold.cce5b8ec.ttf',
          revision: 'cce5b8ec'
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Bold.ec17d132.woff2',
          revision: 'ec17d132'
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Regular.07ef19e7.ttf',
          revision: '07ef19e7'
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Regular.55fac258.woff2',
          revision: '55fac258'
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Regular.dad44a7f.woff',
          revision: 'dad44a7f'
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Bold.9f256b85.woff',
          revision: '9f256b85'
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Bold.b18f59e1.ttf',
          revision: 'b18f59e1'
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Bold.d42a5579.woff2',
          revision: 'd42a5579'
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Regular.7c187121.woff',
          revision: '7c187121'
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Regular.d3c882a6.woff2',
          revision: 'd3c882a6'
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Regular.ed38e79f.ttf',
          revision: 'ed38e79f'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Bold.b74a1a8b.ttf',
          revision: 'b74a1a8b'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Bold.c3fb5ac2.woff2',
          revision: 'c3fb5ac2'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Bold.d181c465.woff',
          revision: 'd181c465'
        },
        {
          url: '/_next/static/media/KaTeX_Main-BoldItalic.6f2bb1df.woff2',
          revision: '6f2bb1df'
        },
        {
          url: '/_next/static/media/KaTeX_Main-BoldItalic.70d8b0a5.ttf',
          revision: '70d8b0a5'
        },
        {
          url: '/_next/static/media/KaTeX_Main-BoldItalic.e3f82f9d.woff',
          revision: 'e3f82f9d'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Italic.47373d1e.ttf',
          revision: '47373d1e'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Italic.8916142b.woff2',
          revision: '8916142b'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Italic.9024d815.woff',
          revision: '9024d815'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Regular.0462f03b.woff2',
          revision: '0462f03b'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Regular.7f51fe03.woff',
          revision: '7f51fe03'
        },
        {
          url: '/_next/static/media/KaTeX_Main-Regular.b7f8fe9b.ttf',
          revision: 'b7f8fe9b'
        },
        {
          url: '/_next/static/media/KaTeX_Math-BoldItalic.572d331f.woff2',
          revision: '572d331f'
        },
        {
          url: '/_next/static/media/KaTeX_Math-BoldItalic.a879cf83.ttf',
          revision: 'a879cf83'
        },
        {
          url: '/_next/static/media/KaTeX_Math-BoldItalic.f1035d8d.woff',
          revision: 'f1035d8d'
        },
        {
          url: '/_next/static/media/KaTeX_Math-Italic.5295ba48.woff',
          revision: '5295ba48'
        },
        {
          url: '/_next/static/media/KaTeX_Math-Italic.939bc644.ttf',
          revision: '939bc644'
        },
        {
          url: '/_next/static/media/KaTeX_Math-Italic.f28c23ac.woff2',
          revision: 'f28c23ac'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Bold.8c5b5494.woff2',
          revision: '8c5b5494'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Bold.94e1e8dc.ttf',
          revision: '94e1e8dc'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Bold.bf59d231.woff',
          revision: 'bf59d231'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Italic.3b1e59b3.woff2',
          revision: '3b1e59b3'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Italic.7c9bc82b.woff',
          revision: '7c9bc82b'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Italic.b4c20c84.ttf',
          revision: 'b4c20c84'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Regular.74048478.woff',
          revision: '74048478'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Regular.ba21ed5f.woff2',
          revision: 'ba21ed5f'
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Regular.d4d7ba48.ttf',
          revision: 'd4d7ba48'
        },
        {
          url: '/_next/static/media/KaTeX_Script-Regular.03e9641d.woff2',
          revision: '03e9641d'
        },
        {
          url: '/_next/static/media/KaTeX_Script-Regular.07505710.woff',
          revision: '07505710'
        },
        {
          url: '/_next/static/media/KaTeX_Script-Regular.fe9cbbe1.ttf',
          revision: 'fe9cbbe1'
        },
        {
          url: '/_next/static/media/KaTeX_Size1-Regular.e1e279cb.woff',
          revision: 'e1e279cb'
        },
        {
          url: '/_next/static/media/KaTeX_Size1-Regular.eae34984.woff2',
          revision: 'eae34984'
        },
        {
          url: '/_next/static/media/KaTeX_Size1-Regular.fabc004a.ttf',
          revision: 'fabc004a'
        },
        {
          url: '/_next/static/media/KaTeX_Size2-Regular.57727022.woff',
          revision: '57727022'
        },
        {
          url: '/_next/static/media/KaTeX_Size2-Regular.5916a24f.woff2',
          revision: '5916a24f'
        },
        {
          url: '/_next/static/media/KaTeX_Size2-Regular.d6b476ec.ttf',
          revision: 'd6b476ec'
        },
        {
          url: '/_next/static/media/KaTeX_Size3-Regular.9acaf01c.woff',
          revision: '9acaf01c'
        },
        {
          url: '/_next/static/media/KaTeX_Size3-Regular.a144ef58.ttf',
          revision: 'a144ef58'
        },
        {
          url: '/_next/static/media/KaTeX_Size3-Regular.b4230e7e.woff2',
          revision: 'b4230e7e'
        },
        {
          url: '/_next/static/media/KaTeX_Size4-Regular.10d95fd3.woff2',
          revision: '10d95fd3'
        },
        {
          url: '/_next/static/media/KaTeX_Size4-Regular.7a996c9d.woff',
          revision: '7a996c9d'
        },
        {
          url: '/_next/static/media/KaTeX_Size4-Regular.fbccdabe.ttf',
          revision: 'fbccdabe'
        },
        {
          url: '/_next/static/media/KaTeX_Typewriter-Regular.6258592b.woff',
          revision: '6258592b'
        },
        {
          url: '/_next/static/media/KaTeX_Typewriter-Regular.a8709e36.woff2',
          revision: 'a8709e36'
        },
        {
          url: '/_next/static/media/KaTeX_Typewriter-Regular.d97aaf4a.ttf',
          revision: 'd97aaf4a'
        },
        {
          url: '/_next/static/media/e2008ff4e1104eb8-s.p.woff2',
          revision: 'fea653da288ee2f9ca6630a73c4608ee'
        },
        {
          url: '/cluezy-logo.png',
          revision: '3d4245f116c37947eed35cc20ad0a8f6'
        },
        { url: '/config/main', revision: '7d45bc572a14e80593b309ab70387cb3' },
        {
          url: '/config/models.json',
          revision: '736c09f78975831b53ad6ab12dccd480'
        },
        {
          url: '/icons/icon-128x128.png',
          revision: 'd58379dc8be5b68fd7df5be2f5f1fd41'
        },
        {
          url: '/icons/icon-144x144.png',
          revision: 'e97f5f3d620220d351b314dd27c3e5ef'
        },
        {
          url: '/icons/icon-152x152.png',
          revision: 'c1379141e12d9a124357a397e535cf85'
        },
        {
          url: '/icons/icon-192x192.png',
          revision: 'c0b1bcc839b08f21f54dd99ecd6153da'
        },
        {
          url: '/icons/icon-384x384.png',
          revision: '5b801b6dbbc2688a334e6b639d4d8ecf'
        },
        {
          url: '/icons/icon-512x512.png',
          revision: '0f3d67af57ce66b46aafa7ae100e6eca'
        },
        {
          url: '/icons/icon-72x72.png',
          revision: '689e6290b2785475c3dc90fda107f283'
        },
        {
          url: '/icons/icon-96x96.png',
          revision: 'ce75e00d87d87501c24ea27484cc8d9a'
        },
        {
          url: '/images/placeholder-image.png',
          revision: '248cd93171aadd58eddcdabe6f0a7d64'
        },
        { url: '/manifest.json', revision: '3eccbae9a51c2f3c61b335bde7fd9567' },
        {
          url: '/providers/logos/Abstract69.svg',
          revision: '054a8769e7b3d0f0053d38d871d62650'
        },
        {
          url: '/providers/logos/anthropic.svg',
          revision: '71fec5bf8e3a86859f06fe5f2d3e1687'
        },
        {
          url: '/providers/logos/azure.svg',
          revision: '30c5c953e081852e72a1e9f977882e92'
        },
        {
          url: '/providers/logos/deepseek.svg',
          revision: '97449377dc4439692cccc88849d35c5c'
        },
        {
          url: '/providers/logos/fireworks.svg',
          revision: '1b04b9e85f076a388966f1a003b436e1'
        },
        {
          url: '/providers/logos/google.svg',
          revision: 'd24cebd2b6b090494ee51c330bbabe90'
        },
        {
          url: '/providers/logos/groq.svg',
          revision: '0860b6726e62324473dbf01c33a0236e'
        },
        {
          url: '/providers/logos/ollama.svg',
          revision: 'b25b541ee7e0cba70d4bb1154079f217'
        },
        {
          url: '/providers/logos/openai-compatible.svg',
          revision: 'd215699d5e6fcfac9b77530b2f0758a5'
        },
        {
          url: '/providers/logos/openai.svg',
          revision: 'fdd50a13e9319c6b27531319248a6846'
        },
        {
          url: '/providers/logos/xai.svg',
          revision: 'e9ff921e588df1864d26492c4cc8ad9a'
        },
        {
          url: '/screenshot-2025-05-04.png',
          revision: 'd51317a9172cdcd0b9e225490ee4b336'
        },
        {
          url: '/screenshot-2025-05-041.png',
          revision: '54be2b7fed320086cd5bab189444a4cc'
        }
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: i,
              state: s
            }) =>
              a && 'opaqueredirect' === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: a.headers
                  })
                : a
          }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const a = e.pathname
        return !a.startsWith('/api/auth/') && !!a.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })
        ]
      }),
      'GET'
    ))
})
