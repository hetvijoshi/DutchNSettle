import React, { useContext, useEffect } from "react"
import classes from "./GroupsTab.module.scss"
import { useSession } from "next-auth/react"
import { GroupCustomCard } from "@/components/GroupCustomCard/GroupCustomCard"
import { getGroupsByUser } from "@/app/services/GroupService"
import { GroupsContext } from "@/app/lib/utility/context"

const GroupsTab = () => {
  const { data: session } = useSession();
  const { groups, setGroups } = useContext(GroupsContext);

  const fetchAllGroups = async () => {
    const token = session["id_token"]
    const userId = session.user["userId"]
    const response = await getGroupsByUser(userId, token)
    setGroups(response.data)
  }
  useEffect(() => {
    if (session) {
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