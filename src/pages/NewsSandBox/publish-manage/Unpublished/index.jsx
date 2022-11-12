import NewsPublish from '../../../../components/NewsPublish'
import usePublish from '../usePublish'

export default function Unpublished() {
const {dataSource}= usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource} type={1}></NewsPublish>
    </div>
  )
}
