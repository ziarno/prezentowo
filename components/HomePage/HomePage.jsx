import React from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'

HomePage = () => {
  const imagesPath = 'images/home-page/'
  const cards = [
    {
      image: '1-create-event',
      text: 'Create event'
    },
    {
      image: '2-add-participants',
      text: 'Add participants'
    },
    {
      image: '3-add-presents',
      text: 'Add presents'
    }
  ]

  return (
    <div id="home-page">

      <h1 className="jumbo">
        <T>hints.welcomeMessage</T>
      </h1>

      <div className="ui cards">
        {cards.map((card, index) => (
          <div
            key={index}
            className="ui card">
            <Img
              className="image waves-effect"
              src={`${imagesPath}${card.image}-small.png`}
              modalSrc={`${imagesPath}${card.image}.png`}
            />
            <div className="content">
              <div className="header">
                <span>{index + 1}.&nbsp;</span>
                <T>{card.text}</T>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!Meteor.userId() ? (
          <button
            onClick={() => FlowRouter.go('/sign-up')}
            className="ui primary button waves-effect waves-button"
          >
            <T>Create an account</T>
          </button>
        ) : null
      }

    </div>
  )
}
