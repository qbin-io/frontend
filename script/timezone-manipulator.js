[...document.querySelectorAll("[data-time-in]")].forEach((e) => {
    let time = e[e.getAttribute("data-time-in")];
    if (!time) return console.warn("[Timezone Manipulator] The property doesn't exist.", e);
    time = time.match(/^\s*(?:(\d+)-(\d+)-(\d+)\s+)?(\d+):(\d+)(?::(\d+))?(?:\s+\(UTC\))?\s*$/);
    if (!time) return console.warn("[Timezone Manipulator] Time is not in format '[YYYY-MM-DD ]hh:mm[:ss][ UTC]' (parts in brackets are optional) an thus cannot be processed.", e);

    const date = new Date();
    if (time.length >= 6) {
        date.setUTCFullYear(parseInt(time[1], 10));
        date.setUTCMonth(parseInt(time[2], 10) - 1);
        date.setUTCDate(parseInt(time[3], 10));
    }
    date.setUTCHours(time.length >= 6 ? parseInt(time[4], 10) : parseInt(time[1], 10));
    date.setUTCMinutes(time.length >= 6 ? parseInt(time[5], 10) : parseInt(time[2], 10));
    if ((time.length == 4 && time[3] !== undefined) || (time.length == 7 && time[6] !== undefined)) {
        date.setUTCSeconds(time.length == 7 ? parseInt(time[6], 10) : parseInt(time[3], 10));
    } else {
        date.setUTCSeconds(0);
    }

    let timeString = (time.length >= 6 ? date.toLocaleDateString() + " " : "") + date.toLocaleTimeString();
    if (!(time.length == 4 && time[3] !== undefined) && !(time.length == 7 && time[6] !== undefined)) {
        timeString = timeString.replace(/:00(\s|$)/, "$1");
    }

    e[e.getAttribute("data-time-in")] = timeString;
});
