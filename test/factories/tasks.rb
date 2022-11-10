FactoryBot.define do
  factory :task do
    name { 'MyString' }
    description { 'MyText' }
    author_id { association :author, factory: :manager }
    assignee_id { association :assignee, factory: :manager }
    state { 'MyString' }
    expired_at { '2022-11-10' }
  end
end
