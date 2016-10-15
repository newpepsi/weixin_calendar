class arrow {
    static now() { return new Arrow() }
    static get( arg ) {
        return new Arrow( arg )
    }
}
class Arrow {
    constructor( param ) {
        this.date_map = { years: 365 * 24 * 60 * 60, weeks: 24 * 60 * 60 * 7, days: 24 * 60 * 60, hours: 60 * 60, minutes: 60, seconds: 1 }
        if( Number.isInteger( param ) ) {
            this.date = new Date( param )
            this.timestamp = param
        } else {
            try {
                if( param.getTime() ) {
                    this.date = param
                    this.timestamp = param.getTime()
                }
            } catch( e ) {
                this.date = new Date()
                this.timestamp = this.date.getTime()
            }
        }
    }
    replace( shifts ) {
        var second_offset = 0
        for(let k in shifts ) {
            // console.log( k, this.date_map[ k ] )
            let v = shifts[ k ]
            second_offset = second_offset + this.date_map[ k ] * v
        }
        this.timestamp = this.timestamp + second_offset*1000
        return this
    }
    get_date() { return new Date( this.timestamp ) }
}

module.exports = {arrow:arrow,Arrow:Arrow}