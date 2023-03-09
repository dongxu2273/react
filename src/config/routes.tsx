
import { Navigate } from 'react-router-dom'
import UseList from '../page/components/useList'
import UseDetail from '../page/components/useDetail'

const routes= [
    {
        path:"/",
        element:<Navigate to="/useList"/>
    },
{
    path:"/useList",
    element:<UseList/>
},
{
    path:"/useDetail",
    element:<UseDetail/>,
},


];

export default routes