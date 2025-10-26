import { useEffect, useState } from 'react'
import '../index.css'
import { getTeams } from '../Scripts/login'
import { useNavigate } from 'react-router-dom'
import CreateTeamModal from '../Components/CreateTeamModal'
import EditTeamModal from '../Components/EditTeamModal'

function Teams() {
  const [teams, setTeams] = useState([])
  const [ready, setReady] = useState(false)

  const [reload, setReload] = useState(false)

  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const [teamEdit, setTeamEdit ] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const data = await getTeams()
      setTeams(data)
      setReady(true)
    }
    init()
  }, [reload])

  function viewTeam(team_id) {
    navigate(`${team_id}`)
  }

  function editTeam(team) {
    setShowEdit(true)
    setTeamEdit(team)
  }

  function handleClose() {
    setShowCreate(false)
    setReload((r) => !r)
  }

  function handleCloseEdit() {
    setShowEdit(false)
    setReload((r) => !r)
  }

  if (!ready) return <p>Loading...</p>
  return (
    <>
      <CreateTeamModal
        show={showCreate}
        onConfirm={handleClose}
        onCancel={handleClose}
      />
      <EditTeamModal
        show={showEdit}
        onConfirm={handleCloseEdit}
        onCancel={handleCloseEdit}
        team={teamEdit}
      />
      <div className='flex flex-row my-10'>
        <p className='mr-auto ml-auto text-4xl'>My Teams: </p>
        <button onClick={() => setShowCreate(true)} style={{backgroundColor: "#457B9D"}} className='ml-auto mr-85 px-10'>Create Team</button>
      </div>
      <div className='flex flex-wrap w-8/10 justify-self-center gap-4 justify-center'>
        {teams.map((item => (
          <div key={item.team_id} style={{backgroundColor: item.color}} className='sm:w-1/3 md:w-1/4 rounded-md p-2 shadow-md hover:scale-105 ease-in-out duration-200'> 
            <div className='flex flex-row items-center'>
              {item.logo_url != null ? (<img src={item.logo_url} alt=""className='w-15 mx-2 m-2'/>) : <img src='/question-sign.png' className='w-15 mx-2 m-2'></img>}
              <p className='ml-auto mr-5 text-2xl font-bold'>{item.team_name}</p>
            </div>
            <div>
              <button onClick={() => viewTeam(item.team_id)} className='p-1 mx-3'>View Team</button>
              <button onClick={() => editTeam(item)} className='p-1 mx-3'>Edit Team</button>
            </div>
          </div>
        )))} 
      </div>
    </>
  )
}

export default Teams