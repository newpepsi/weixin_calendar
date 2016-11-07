//calendar
var util = require( '../util.js' )
var arrow = require( '../arrow.js' )

function isLeapYear( year ) {
    return ( ( ( year % 4 ) == 0 ) && ( ( year % 100 ) != 0 ) || ( ( year % 400 ) == 0 ) )
}
function getDaysInMonth( month, year ) {
    var days
    if( month in [ 1, 3, 5, 7, 8, 10, 12 ] ) {
        days = util.range( 31 )
    } else if( month in [ 4, 6, 9, 11 ] ) {
        days = util.range( 30 )
    } else if( month == 2 && isLeapYear( year ) ) {
        days = util.range( 29 );
    } else {
        days = util.range( 28 );
    }
    return days;
}
var week_lang = ['周日','周一','周二','周三','周四','周五','周六']

class Calendar {
    // """
    // Base calendar class. This class doesn't do any formatting. It simply
    // provides data to subclasses.
    // """

    constructor( firstweekday = 0 ) {
        this.firstweekday = firstweekday //# 0 = Sunday, 6 = Saturday
    }
    getweekheader(){
        return this.weekdays().map(function(i){ return week_lang[i]})
    }
    weekdays() {
        // """
        // Return a iterator for one week of weekday numbers starting with the
        // configured first one.
        // """
        var i = null
        return util.range( this.firstweekday, this.firstweekday + 7 ).map( function( i ) {
            return i % 7
        })
        
        // for( i in util.range( this.firstweekday, this.firstweekday + 7 )){
        //     yield i % 7
        // }
    }
    monthdates( year, month ) {
        // """
        // Return an array for one month. The array is filled by Date 
        // objects and will always return complete weeks, so it will provide
        // dates outside the specified month.
        // """
        // console.log( year, month )
        var local_month = month - 1
        var date = new Date( year, local_month, 1 )
        var loop = true
        // # Go back to the beginning of the week
        let days = ( date.getDay() - this.firstweekday ) % 7
        let days_amount = getDaysInMonth( year, month )
        let _max_deep = ( days < 5 || ( days >= 5 && days_amount < 31 ) ) ? 35 : 42
        // console.log( days, days_amount, _max_deep )
        date = arrow.arrow.get( date ).replace( { days: -days }).get_date()
        // console.log( util.formatTime( date ) )
        var date_queue = []
        let counter = 0
        while( loop ) {
            try {
                if( counter >= _max_deep ) { break }
                date_queue.push( date )
                date = arrow.arrow.get( date ).replace( { days: 1 }).get_date()
                // console.log( util.formatTime( date ), date.getDay() )
                // console.log( date.getMonth() > local_month, date.getDay() == this.firstweekday )

            } catch( e ) {
                // # Adding one day could fail after datetime.MAXYEAR
                break
            }
            counter++
        }
        return date_queue
    }

    monthdays2( year, month ) {
        //"""
        //Like monthdates(), but will yield (day number, weekday number)
        //array. For days outside the specified month the day number is 0.
        //"""
        var date_queue = this.monthdates( year, month ).map( function( date ) {
            let dat = [ date.getDay(), date ]
            if( date.getMonth() != month - 1 ) {
                dat.unshift( 0 )
            } else {
                dat.unshift( date.getDate() )
            }
            return dat
        })
        return date_queue
    }

    monthdays( year, month ) {
        // """
        // Like monthdates(), but will yield day numbers. For days outside
        // the specified month the day number is 0.
        // """

        return this.monthdates( year, month ).map( function( date ) {
            if( date.getMonth() != month - 1 ) {
                return 0
            } else {
                return date.getDate()
            }
        })
    }

    monthdatescalendar( year, month ) {
        // """
        // Return a matrix (list of lists) representing a month's calendar.
        // Each row represents a week; week entries are datetime.date values.
        // """
        var dates = this.monthdates( year, month )
        return util.range( 0, dates.length, 7 ).map( function( x ) {
            return dates.slice( x, x + 7 )
        })

        // return [ dates[ i:i + 7 ] for i in range( 0, len( dates ), 7 ) ]
    }

    monthdays2calendar( year, month ) {
        // """
        // Return a matrix representing a month's calendar.
        // Each row represents a week; week entries are
        // (day number, weekday number) tuples. Day numbers outside this month
        // are zero.
        // """
        var days = this.monthdays2( year, month )
        // console.log( util.range( 0, days.length, 7 ) )
        return util.range( 0, days.length, 7 ).map( function( x ) {
            // console.log( days.slice( x, x + 7 ) )
            return days.slice( x, x + 7 )
        })
    }

    monthdayscalendar( year, month ) {
        // """
        // Return a matrix representing a month's calendar.
        // Each row represents a week; days outside this month are zero.
        // """
        let days = this.monthdays( year, month )
        util.range( 0, days.length, 7 ).map( function( x ) {
            return days.slice( x, x + 7 )
        })
        return days
    }
    yeardatescalendar( year, width = 3 ) {
        // """
        // Return the data for the specified year ready for formatting. The return
        // value is a list of month rows. Each month row contains upto width months.
        // Each month contains between 4 and 6 weeks and each week contains 1-7
        // days. Days are datetime.date objects.
        // """
        // months = [
        //     self.monthdatescalendar( year, i )
        //     for i in range( January, January + 12 )
        // ]
        // return [ months[ i:i + width ] for i in range( 0, len( months ), width ) ]
    }

    yeardays2calendar( year, width = 3 ) {
        // """
        // Return the data for the specified year ready for formatting (similar to
        // yeardatescalendar()). Entries in the week lists are
        // [day number, weekday number] array. Day numbers outside this month are
        // zero.
        // """
        // months = [
        //     self.monthdays2calendar( year, i )
        //     for i in range( January, January + 12 )
        // ]
        // return [ months[ i:i + width ] for i in range( 0, len( months ), width ) ]
    }

    yeardayscalendar( year, width = 3 ) {
        // """
        // Return the data for the specified year ready for formatting (similar to
        // yeardatescalendar()). Entries in the week lists are day numbers.
        // Day numbers outside this month are zero.
        // """
        // months = [
        //     self.monthdayscalendar( year, i )
        //     for( i in range( January, January + 12 ) ) {
        // ]
        //     return [ months[ i:i + width ] for i in range( 0, len( months ), width ) ]
        //     }
    }
}
// 不支持ES6 的类继承
// class CalendarView extends Calendar {
//     constructor( view, firstweekday = 0 ) {
//         this.firstweekday = firstweekday //# 0 = Sunday, 6 = Saturday
//         this.view = view
//     }
//     pre_month( e ) {

//     }
//     next_month( e ) {

//     }
//     change_month( e ) {

//     }
//     change_year( e ) {

//     }
// }
module.exports = {
    Calendar: Calendar
}
