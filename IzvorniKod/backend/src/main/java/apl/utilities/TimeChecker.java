package apl.utilities;

import java.time.LocalDateTime;

public class TimeChecker {

    public static boolean isWithinTimeRange(LocalDateTime time, LocalDateTime startMoment, LocalDateTime endMoment) {
        if (startMoment == null && endMoment == null) {
            return true; // No time range specified, so all times are within the range.
        }

        boolean afterStart = startMoment == null || !time.isBefore(startMoment);
        boolean beforeEnd = endMoment == null || !time.isAfter(endMoment);

        return afterStart && beforeEnd;
    }

}
