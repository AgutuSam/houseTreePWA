import React from 'react';
import { MessageCircleIcon } from 'lucide-react';
const conversations = [{
  id: 1,
  name: 'Sarah Johnson',
  property: 'Modern Downtown Apartment',
  lastMessage: "Hi, I'm interested in viewing the apartment this weekend.",
  time: '2h ago',
  unread: true,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}, {
  id: 2,
  name: 'Michael Brown',
  property: 'Luxury Condo with City Views',
  lastMessage: 'Thank you for the virtual tour! When can I schedule an in-person viewing?',
  time: '1d ago',
  unread: false,
  avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}];
export const Messages = () => {
  return <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Messages
      </h1>
      {conversations.length > 0 ? <div className="space-y-4">
          {conversations.map(conversation => <div key={conversation.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
              <div className="flex items-start space-x-4">
                <img src={conversation.avatar} alt={conversation.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.name}
                    </h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Re: {conversation.property}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
              </div>
            </div>)}
        </div> : <div className="text-center py-12">
          <MessageCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start conversations with property owners or agents
          </p>
        </div>}
    </div>;
};