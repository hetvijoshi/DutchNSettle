import React, { useEffect, useState } from "react"
import classes from "./GroupsTab.module.scss"
import { useSession } from "next-auth/react"
import { GroupCustomCard } from "@/components/GroupCustomCard/GroupCustomCard"
import { getGroupsByUser } from "@/app/services/GroupService"

const GroupsTab = () => {
  const { data: session } = useSession();
  const [groups, setGroups] = useState([]);

  const fetchAllGroups = async () => {
    const token = session["id_token"]
    const userId = session.user["userId"]
    const response = await getGroupsByUser(userId, token)
    console.log(response.data)
    setGroups(response.data)
  }
  useEffect(() => {
    if (session) {
      console.log(session)
      fetchAllGroups()
    }
  }, [session])
  return (
    <>
      {
        session && (
          <div className={classes.card_wrapper}>
            {groups.map((group) => (
              <GroupCustomCard key={group.groupName} groupDetail={group} />
            ))}
          </div>
        )
      }

    </>

  )
}

export default GroupsTab