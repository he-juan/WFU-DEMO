import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import ContactsTab from './ContactsTab'
import GroupTab from './GroupTab'

const routes = [
  { tab: 'r_040', path: '/manage/calling_contacts/contactslist', component: ContactsTab },
  { tab: 'r_041', path: '/manage/calling_contacts/group', component: GroupTab }
]
class Contacts extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
        redirect={{ from: '/manage/calling_contacts/', to: '/manage/calling_contacts/contactslist' }}
      />
    )
  }
}

export default Contacts
