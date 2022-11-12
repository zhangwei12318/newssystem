import NewsPublish from '../../../../components/NewsPublish'
import usePublish from '../usePublish'

export default function Sunset() {
const {dataSource}= usePublish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource} type={3}></NewsPublish>
    </div>
  )
}