export const numberOnly = (event) => {
  if(!/[0-9]/.test(event.key))
  {
      event.preventDefault();
  }
};

export const decimalOnly = (event) => {
  if(!/[0-9]/.test(event.key) && event.key != '.')
  {
      event.preventDefault();
  }
};

export const getDateByYear = (years) => {
  const date = new Date();
  date.setFullYear( date.getFullYear() + years );
  return date;
}

export const getDateFromDay = (x) => {
  const now = new Date();
  now.setDate(now.getDate() + (x + (7 - now.getDay())) % 7);
  return now;
}

export const parseJSON = (string) => {
  try
  {
    return JSON.parse(string);
  }
  catch(err)
  {
    console.log(err.message);
    return null;
  }
}

export const getGeocode = async(location) => {
  try
  {
    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder.geocode({ location: location });
    return response;
  }
  catch(e)
  {
    console.log(e);
  }
}

export const getRadiusOptions = () => {
  const start = 5;
  const end = 50;
  const step = 5;
  
  let options = [];
  for(let i=start; i <= end; i+=step)
  {
    options.push({value: i, label: i.toString()});
  }
  return options;
}

export const getDayHourList = () => {
  const dayList = [
      {id: 0, name: 'Sunday'},
      {id: 1, name: 'Monday'},
      {id: 2, name: 'Tuesday'},
      {id: 3, name: 'Wednesday'},
      {id: 4, name: 'Thursday'},
      {id: 5, name: 'Friday'},
      {id: 6, name: 'Saturday'},
  ];
  const hourList = [
      {id: 1, name: '01 - 02'},
      {id: 2, name: '02 - 03'},
      {id: 3, name: '03 - 04'},
      {id: 4, name: '04 - 05'},
      {id: 5, name: '05 - 06'},
      {id: 6, name: '06 - 07'},
      {id: 7, name: '07 - 08'},
      {id: 8, name: '08 - 09'},
      {id: 9, name: '09 - 10'},
      {id: 10, name: '10 - 11'},
      {id: 11, name: '11 - 12'},
      {id: 12, name: '12 - 01'},
  ];
  const periodList = [
      {id: 'am', name: 'AM'},
      {id: 'pm', name: 'PM'},
  ];
  
  return {
    'dayList': dayList, 
    'hourList': hourList, 
    'periodList': periodList,
  };
}

export const getCurrentDayHour = () => {
  const result = {
    day: '',
    hour: '',
    period: '',
  };
  
  let now = new Date();
  let day = now.getDay();
  let hours = now.getHours();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  const dayHourList = getDayHourList();
  if(dayHourList.dayList && dayHourList.dayList.length > 0)
  {
    let index = dayHourList.dayList.findIndex(x => x.id === day);
    if(index !== -1 && dayHourList.dayList[index])    // if exists
    {
      result.day = dayHourList.dayList[index].name;
    }
  }
  if(dayHourList.hourList && dayHourList.hourList.length > 0)
  {
    let index = dayHourList.hourList.findIndex(x => x.id === hours);
    if(index !== -1 && dayHourList.hourList[index])    // if exists
    {
      result.hour = dayHourList.hourList[index].name;
    }
  }
  if(dayHourList.periodList && dayHourList.periodList.length > 0)
  {
    let index = dayHourList.periodList.findIndex(x => x.id === ampm);
    if(index !== -1 && dayHourList.periodList[index])    // if exists
    {
      result.period = dayHourList.periodList[index].name;
    }
  }
  
  return result;
}

export const calcCartDateTime = (day, hour, period) => {
  let result = null;
  
  let dayId, hourId, periodId;
  const dayHourList = getDayHourList();
  if(dayHourList.dayList && dayHourList.dayList.length > 0)
  {
    let index = dayHourList.dayList.findIndex(x => x.name === day);
    if(index !== -1 && dayHourList.dayList[index])    // if exists
    {
      dayId = dayHourList.dayList[index].id;
    }
  }
  if(dayHourList.hourList && dayHourList.hourList.length > 0)
  {
    let index = dayHourList.hourList.findIndex(x => x.name === hour);
    if(index !== -1 && dayHourList.hourList[index])    // if exists
    {
      hourId = dayHourList.hourList[index].id;
    }
  }
  if(dayHourList.periodList && dayHourList.periodList.length > 0)
  {
    let index = dayHourList.periodList.findIndex(x => x.name === period);
    if(index !== -1 && dayHourList.periodList[index])    // if exists
    {
      periodId = dayHourList.periodList[index].id;
    }
  }
  
  if(parseInt(dayId) >= 0 && hourId && periodId)
  {
    const date = getDateFromDay(dayId);
    let hours = hourId;
    if(periodId === "pm" && hours < 12) hours = hours + 12;
    if(periodId === "am" && hours == 12) hours = hours - 12;
    date.setHours(hours, 0, 0, 0);
    result = date;
  }
  
  return result;
}

