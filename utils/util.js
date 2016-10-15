function formatTime( date ) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [ year, month, day ].map( formatNumber ).join( '/' ) + ' ' + [ hour, minute, second ].map( formatNumber ).join( ':' )
}

function formatNumber( n ) {
  n = n.toString()
  return n[ 1 ] ? n : '0' + n
}

function range( start, end, step = 0 ) {
  var ary = []
  if( step > 0 ) {
    let distance = end - start
    console.log(distance,distance/step,distance% step)
    let _end = parseInt( distance / step )
    for( let i = start;i < _end;i++ ) {
      ary.push( start + ( i * step ) )
    }
    if( distance % step > 0 ) { ary.push( end ) }
  }else if(start>-1&& end>0){
    for (let i = start;i<end;i++){
      ary.push(i)
    }
  } else {
    for( var i = 0;i < start;i++ ) {
      ary.push( i + step )
    }
  }
  return ary
}

module.exports = {
  formatTime: formatTime,
  range: range
}
