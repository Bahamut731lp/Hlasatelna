const addEventLog = (config) => {
    addEventListener('beforeunload', () => {
        const events = JSON.parse(sessionStorage.getItem("events") ?? "[]");
    
        sessionStorage.setItem("events", JSON.stringify([...events, config]))
    });
}