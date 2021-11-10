import { Grid } from "@mui/material"
import * as React from "react"
import Calendar from "../../../Shared/Calendar/Calendar"
import Appointments from "../../Appointments/Appointments"

const DashbordHoem = () => {
  const [date, setDate] = React.useState(new Date())

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4} md={12} sm={12}>
          <Calendar date={date} setDate={setDate}></Calendar>
        </Grid>
        <Grid item xs={8} md={12} sm={12}>
          <Appointments date={date}></Appointments>
        </Grid>
      </Grid>
    </div>
  )
}

export default DashbordHoem
