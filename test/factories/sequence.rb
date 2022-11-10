FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password] do |n|
    "string#{
      n
    }"
  end
  sequence :email do |n|
    "person#{n}@example.com"
  end
  sequence :avatar do |n|
    "#{:first_name}#{n}.jpg"
  end
  sequence :type do |_n|
    'developer'
  end
end
