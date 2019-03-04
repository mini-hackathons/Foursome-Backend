module.exports = {
    getCalendar: async (req, res) => {
        try{
            // Get Calendar from Google----
            // const access_token = await User.get(access_token, refresh_token);
            // const calendarData = getCalendarFromGoogle(access_token, refresh_token);
            
            res.status(201).send({
                calendarData
            });
        }catch(err) {
            res.status(404).send({
                err
            });
        }
    },
    updateCalendar: async (req, res) => {
        try{
            const { updates } = req.body;
            // const access_token = await User.get(access_token, refresh_token);
            // await User.save(updates)
            const calendarData = await getCalendarFromGoogle(accessToken, refreshToken);
            
            res.status(201).send({
                calendarData
            });
        }catch(err){
            res.status(404).send({
                err
            });
        }
    },
    getCalendarFromGoogle: async (accessToken, refreshToken) => {
        try{
            // let calendarData = await get Calendar from Google(accessToken)

            if(!calendarData){
                // Mayber do this later if you have time----
                // Use refreshToken to get new accessToken----
                // accessToken = await googleAPI(refreshToken);
                // Save new access_token to User
                // await User.save(access_token);

                // try to get Calendar again----
                // calendarData = await getCalendar from Google(accessToken)
            }

            calculateBitwiseCalendar(calendarData);

            return calendarData;
        }catch(err) {
            // return nothing
        }
    },
    calculateBitwiseCalendar: async (calendarData) => {
        try{
            // const bitwiseCalendar = Convert calendar to bits
            // await User.save(bitweiseCalendar);
        }catch(err) {
            console.log(err);
        }
    }
}