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
  const [teamEdit, setTeamEdit] = useState(null)

  const [search, setSearch] = useState('')

  const navigate = useNavigate()

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

  if (!ready) return <p className='mt-20'>Loading...</p>

  const filteredTeams = teams.filter((team) => {
    if (!search.trim()) return true
    const text = search.toLowerCase()
    return (
      team.team_name?.toLowerCase().includes(text) ||
      team.abbreviation?.toLowerCase().includes(text)
    )
  })

  return (
    <>
      {/* Create & Edit Modals */}
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

      {/* Header + Create Button */}
      <div className='flex flex-row my-10 items-center px-10 mt-30'>
        <p className='text-4xl font-semibold ml-70 mr-auto'>My Teams:</p>
        <button
          onClick={() => setShowCreate(true)}
          style={{ backgroundColor: '#457B9D' }}
          className='text-white px-6 py-2 mr-70 rounded-lg hover:bg-blue-700 transition'
        >
          Create Team
        </button>
      </div>

      {/* Search Bar */}
      <div className='flex justify-center mb-8'>
        <input
          type='text'
          placeholder='Search teams...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='border border-gray-300 rounded-lg px-4 py-2 w-270 focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
      </div>

      {/* Teams List */}
      <div className='flex flex-wrap w-8/10 justify-self-center gap-4 justify-center'>
        {filteredTeams.length > 0 ? (
          filteredTeams.map((item) => (
            <div
              key={item.team_id}
              style={{ backgroundColor: item.color }}
              className='sm:w-1/3 md:w-1/4 rounded-md p-2 shadow-md hover:scale-105 ease-in-out duration-200'
            >
              <div className='flex flex-row items-center'>
                {item.logo_url ? (
                  <img src={item.logo_url} alt='' className='w-15 h-15 mx-2 m-2' />
                ) : (
                  <img src='/question-sign.png' className='w-15 h-15 mx-2 m-2' />
                )}
                <p className='ml-auto mr-5 text-2xl font-bold'>{item.team_name}</p>
              </div>
              <div>
                <button
                  onClick={() => viewTeam(item.team_id)}
                  className='p-1 mx-3'
                >
                  View Team
                </button>
                <button onClick={() => editTeam(item)} className='p-1 mx-3'>
                  Edit Team
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500 text-lg mt-10'>No matching teams found.</p>
        )}
      </div>
    </>
  )
}

export default Teams
