// ==UserScript==
// @name         Ekşi Lanet Geri Sayıcısı
// @namespace    https://github.com/ismailceylan/EksiSozlukLanetGerisay/
// @version      1.0
// @description  Lanetin bitmesine ne kadar kaldığını görsel olarak izleyin.
// @author       İsmail Ceylan
// @match        https://eksisozluk.com/biri/*
// @grant        none
// ==/UserScript==

( function()
{
    "use strict";

    var second2time = function( seconds, pattern, shortTerms, noZero )
    {
        if( shortTerms === undefined )
        {
            shortTerms = true;
        }

        if( noZero === undefined )
        {
            noZero = true;
        }

        if( Object.prototype.toString.call( seconds ) !== "[object Number]")
        {
            seconds = parseInt( seconds, 10 );
        }

        if( ! pattern )
        {
            pattern = "H:M:S";
        }

        var terms =
        {
                y: [ "yıl", "y" ],
                mn: [ "ay", "a" ],
                d: [ "gün", "g" ],
                h: [ "saat", "sa" ],
                m: [ "dakika", "dk" ],
                s: [ "saniye", "sn" ]
        }

        var Years = 31557600;
        var Months = 2629800;
        var Days = 86400;
        var Hours = 3600;
        var Minutes = 60;

        var years = Math.floor( seconds / Years );
        var years_ = ( years * Years );
        var months = Math.floor(( seconds - years_ ) / Months );
        var months_ = ( months * Months );
        var days = Math.floor(( seconds - years_ - months_ ) / Days );
        var days_ = ( days * Days );
        var hours = Math.floor(( seconds - years_ - months_ - days_ ) / Hours );
        var hours_ = ( hours * Hours );
        var minutes = Math.floor(( seconds - years_ - months_ - days_ - hours_ ) / Minutes );
        var minutes_ = ( minutes * Minutes );
        var secs = seconds - years_ - months_ - days_ - hours_ - minutes_;

        var trimming = function( value )
        {
                if( noZero && value < 1 )
                {
                        return "";
                }

                return value;
        }

        var naming = function( group, value )
        {
                if( ! value )
                {
                        return value;
                }

                if( ! shortTerms )
                {
                        value += " ";
                }

                return value + terms[ group ][ shortTerms? 1 : 0 ];
        }

        var padding = function( value )
        {
                return value.toString().padStart( 2, "0" );
        }

        var nt = function( group, value )
        {
                return naming( group, trimming( value ));
        }

        var np = function( group, value )
        {
                return naming( group, padding( value ));
        }

        var replacementMap =
        [
                [ "Y", nt( "y", years )],
                [ "MN", nt( "mn", months )],
                [ "D", nt( "d", days )],

                [ /hh\*/i, np( "h", hours )],
                [ /h\*/i, naming( "h", hours )],
                [ /hh/i, padding( hours )],
                [ /h/i, hours ],

                [ /mm\*/, np( "m", minutes )],
                [ /m\*/, naming( "m", minutes )],
                [ /mm/, padding( minutes )],
                [ /m/, minutes ],

                [ /ss\*/, np( "s", secs )],
                [ /s\*/, naming( "s", secs )],
                [ /ss/, padding( secs )],
                [ /s/, secs ],
        ];

        var data = [];

        replacementMap.forEach( function( item, i )
        {
                pattern = pattern.replace( item[ 0 ], "{#" + i + "}" );
                data.push( item[ 1 ]);
        });

        data.forEach( function( value, i )
        {
                pattern = pattern.replace( "{#" + i + "}", value );
        });

        return pattern.trim();
}

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
                           '<span>makine ısınıyor...</span>'+
                           '<div></div>'+
                      '</div>' );

    $( "head" ).append( $( "<style></style>" ).text( styles ));
    $( "#content-body > p" ).append( progress );

    setInterval( function()
    {
        var start = new Date( "Mar 31 2020" );
        var end = new Date( "May 30 2020" );
        var left = end - new Date;
        var total = end - start;

        var percent = ( left * 100 / total ).toFixed( 2 );

        progress.find( "div" ).css( "width", percent + '%' );
        progress.find( "span" ).text( second2time( Math.round( left / 1000 ), "Y MN D hh:mm:ss", false ) + " (%" + percent + ")" );
    },
    800 );
})();
