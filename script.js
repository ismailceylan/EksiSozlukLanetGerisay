// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://eksisozluk.com/biri/*
// @grant        none
// ==/UserScript==

( function()
{
    'use strict';


    var styles = `
@keyframes move
{
  0%
  {
    background-position: 0 0;
  }
  100%
  {
    background-position: 50px 50px;
  }
}

.progress
{
    display: block;
    width: 100%;
    border-radius: 41px;
    background-color: rgba(0, 0, 0, 0.3);
    text-align: center;
    color: #fff;
    font-weight: bold;
    margin: 10px 0;
    position: relative;
    overflow: hidden;
}

.progress span
{
    position: relative;
    z-index: 1
}

.progress div
{
    height: 100%;
    background-color: #81c14b;
    position: absolute;
    top: 0;
    border-radius: 0 15px 15px 0;
    background-size: 50px 50px;
    animation: move 2s linear infinite;
    background-image: -webkit-gradient(linear, 0 0, 100% 100%,
			      color-stop(.25, rgba(255, 255, 255, .2)),
			      color-stop(.25, transparent), color-stop(.5, transparent),
			      color-stop(.5, rgba(255, 255, 255, .2)),
			      color-stop(.75, rgba(255, 255, 255, .2)),
			      color-stop(.75, transparent), to(transparent)
			   )
}
`;

    var progress = $( '<div class="progress">'+
                           '<span>%0</span>'+
                           '<div></div>'+
                      '</div>' );

    $( "head" ).append( $( "<style></style>" ).text( styles ));
    $( "#content-body > p" ).prepend( progress );

    setInterval( function()
                {
        var start = new Date( "Mar 31 2020" );
        var end = new Date( "May 30 2020" );

        var percent = (( end - new Date ) * 100 / ( end - start )).toFixed( 2 );

        progress.find( "div" ).css( "width", percent + '%' );
        progress.find( "span" ).text( '%' + percent );
    },
    1200 );
})();
