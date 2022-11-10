class Task < ApplicationRecord
  state_machine :state, initial: :new_task do
    state :in_development
    state :archived
    state :in_qa
    state :in_code_review
    state :ready_for_release
    state :released

    event :start_develop do
      transition [:new_task, :in_code_review, :in_qa] => :in_development
    end

    event :send_to_qa do
      transition in_development: :in_qa
    end

    event :send_to_code_review do
      transition in_qa: :in_code_review
    end

    event :prepare_to_release do
      transition in_code_review: :ready_for_release
    end

    event :send_to_release do
      transition ready_for_release: :released
    end

    event :archive do
      transition [:new_task, :released] => :archived
    end
  end

  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  validates :name, presence: true
  validates :description, presence: true, length: { maximum: 500 }
  validates :author, presence: true
end
