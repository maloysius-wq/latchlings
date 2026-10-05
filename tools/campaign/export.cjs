'use strict';
const COLORS=['coral','blue','mint','gold','lavender'],SUITS=['heart','spade','club','diamond','star'],EXPRESSIONS=['happy','surprised','angry','smug','sleepy','curious','determined'],DIRECTIONS=['U','D','L','R'],TURNS=['CW','CCW'];
function code(values,value){const index=values.indexOf(value);if(index<0)throw new Error(`Unsupported identity/direction ${value}`);return index;}
function encodeLevel(l){
 const encode=(field,values)=>l[field].map(v=>[v[0],v[1],code(values,v[2])]);
 return[l.size,l.pieces.map(p=>[code(COLORS,p.color),code(SUITS,p.suit),...p.pos,code(EXPRESSIONS,p.expression)]),l.nests,l.rocks,l.anchors,encode('suitGates',SUITS),encode('colorGates',COLORS),encode('rails',DIRECTIONS),encode('turners',TURNS),l.switches,l.doors,l.optimal,l.moveLimit,l.solution.map(v=>[v[0],code(DIRECTIONS,v[1])]),l.difficultyScore,l.id,l.chapter];
}
function exportChapter(levels,chapter){
 if(!Number.isInteger(chapter)||chapter<2||chapter>8||levels.length!==50)throw new Error('Export requires one complete 50-slot chapter 2–8');
 for(let i=0;i<50;i++)if(levels[i].id!==(chapter-1)*50+i+1||levels[i].chapter!==chapter)throw new Error('Chapter ID/slot mismatch');
 return 'window.LEVELS.push(...'+JSON.stringify(levels.map(encodeLevel))+'.map(_L));\n';
}
module.exports={encodeLevel,exportChapter};
