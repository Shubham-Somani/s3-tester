import { date } from 'quasar'

const formatDate = (data: { dateString: string, dateFormat: string }) => {
  const {  dateString, dateFormat } = data;
  return date.formatDate(dateString, dateFormat)
}

export {
  formatDate
}