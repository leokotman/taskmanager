FactoryBot.define do
  factory :task do
    name { 'MyString' }
    description { 'MyText' }
    author factory: :manager
    assignee factory: :developer
    state { 'new_task' }
    expired_at { Time.now.to_date }
  end
end
