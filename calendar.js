/*
"Course" Data Structure:
{
	unique_id: integer
	title: string
	start_t: string
	end_t: string
	days: string
	section: Course
}
*/

(function(calendar,$,undefined){

	var TIME_FIELD_WIDTH = 50
	var HEADER_HEIGHT = 20

	var TABLE_HDR = "<div><table id='cs-calendarTable'><tr class='headerRow' style='height:" + HEADER_HEIGHT + "px'> <td></td> <td>Monday</td> <td>Tuesday</td> <td>Wednesday</td> <td>Thursday</td> <td>Friday</td></tr>"
	var TABLE_FTR = "</table></div>"

	var TEN_MINUTE_HEIGHT = 0
	var CELL_HEIGHT = 0
	var CELL_WIDTH = 0

	var DAY_LETTER_CODES = {"M" : 0,
							"T" : 1,
							"W" : 2,
							"R" : 3,
							"F" : 4 }

	var DEBUG = 0

	calendar.addClass = function(course,section) {
		dayNums = (function(dayStr) {
			arr = []
			for (c = 0; c < dayStr.length; c++) {
				console.log(dayStr.charAt(c) + "   " + DAY_LETTER_CODES[dayStr.charAt(c)])
				arr.push(DAY_LETTER_CODES[dayStr.charAt(c)])
			}
			return arr
		})(course.days);

		for (day in dayNums) {
			cell_id = "#" + course.start_t + "-" + dayNums[day];
			cellposn = $(cell_id).offset()
			if (DEBUG) {
				console.log("Cell Posn: " + cellposn.left + " " + cellposn.top)
				console.log("LEN: " + timeToMinutes(course.end_t) + ", " + timeToMinutes(course.start_t))
			}
			var elemHeight = ((timeToMinutes(course.end_t) - timeToMinutes(course.start_t))/10 * TEN_MINUTE_HEIGHT + 1);

			classbox = "<div class='cs-calElem " +  (section ? "cs-sectionbox" : "cs-classbox") + "' style='top: " + (cellposn.top + 1) + "px; left: " + (cellposn.left + 1) + "px; width: " + (CELL_WIDTH + 2) + "px; height: " + elemHeight + "px;'><span style='line-height:" + elemHeight + "px'>" + course.title.toUpperCase() + "</span></div>"
			backgroundDiv = "<div style='position:absolute; background:white; top: " + (cellposn.top + 1) + "px; left: " + (cellposn.left + 1) + "px; width: " + (CELL_WIDTH + 2) + "px; height: " + elemHeight + "px;'></div>"

			$("#cs-calendarTable").append(classbox)
			$(cell_id).append(backgroundDiv)
		}
		if (!section && course.section != null) {
			calendar.addClass(course.section,true)
		}
		calendar.init();
	}

	function makeCell(width,height,unique_id) {
		return "<td class='cs-calendarCell' id='" + unique_id + "' style='width:" + width + "px; height:" + height + "px'></td>"
	}

	calendar.drawCal = function(width,height) {
		// Border is 1px on each side, so subtract 2px from both width and height
		CELL_WIDTH = (width - 6 - TIME_FIELD_WIDTH) / 5 // M-F
		CELL_HEIGHT = (height - 11 - HEADER_HEIGHT) / 10 // 8am-6pm
		TEN_MINUTE_HEIGHT = CELL_HEIGHT / 6

		var calTable = TABLE_HDR
		
		for (var row = 8; row < 19; row++) {
			timeStr = ((row > 12) ? (row - 12) : row) + ((row > 11) ? " PM" : " AM")
			calTable += "<tr><td class='cs-timeField' style='width:" + TIME_FIELD_WIDTH+ "px'>" + timeStr + "</td>"
			for (var col = 0; col < 5; col++) {
				calTable += makeCell(CELL_WIDTH,CELL_HEIGHT, row + "-" + col)
			}
			calTable += "</tr>"
		}
		calTable += TABLE_FTR
		return calTable
	}

	function timeToMinutes(str) {
		tokens = str.split(":")
		console.log(tokens)
		if (tokens.length == 1) {
			console.log(tokens[0] + ", " + tokens[0]*60)
			return tokens[0]*60
		} else if (tokens.length == 2) {
			return parseInt(tokens[0]*60) + parseInt(tokens[1])
		} else {
			console.log("ERROR: UNRECOGNIZED TIME FORMAT (in timeToMinutes)")
		}
		return -1
	}

	calendar.makeCourse = function(start_t,end_t,days,title,section) {
		return { "unique_id": 0, "title": title, "start_t": start_t, "end_t": end_t, "days": days, "section": section }
	}

	calendar.init = function() {
		// set up event handlers
		$('.cs-sectionbox').click(function() {
			$(this).css('background-color','green');
		});
		$('.cs-classbox').click(function() {
			$(this).css('background-color','blue');
		});
	}
}( window.calendar = window.calendar || {}, jQuery ));