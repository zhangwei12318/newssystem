import NewsPublish from '../../../../components/NewsPublish'
import usePublish from '../usePublish'

export default function usePublished() {
const {dataSource}= usePublish(2)
  return (
    <div>
      <NewsPublish dataSource={dataSource} type={2}></NewsPublish>
    </div>
  )
}
