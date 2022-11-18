class Api::V1::TasksController < Api::V1::ApplicationController
  # GET /api/v1/tasks
  def index
    tasks = Task.all.ransack(ransack_params).result.page(page).per(per_page)

    respond_with(tasks, each_serializer: :TaskSerializer, root: 'items', meta: build_meta(tasks))
  end

  # GET /api/v1/tasks/:id
  def show
    task = Task.find(params[:id])

    respond_with(task, serializer: :TaskSerializer)
  end

  # POST /api/v1/tasks/:id
  def create
    task = current_user.my_tasks.new(task_params)
    task.save

    respond_with(task, serializer: :TaskSerializer, location: nil)
  end

  # PUT /api/v1/tasks/:id или PATCH /api/v1/tasks/:id
  def update
    task = Task.find(params[:id])
    task.update(task_params)

    respond_with(task, serializer: :TaskSerializer)
  end

  # DELETE /api/v1/tasks/:id
  def destroy
    task = Task.find(params[:id])
    task.destroy

    respond_with(task)
  end

  private

  def task_params
    params.require(:task).permit(:name, :description, :author_id, :assignee_id, :state_event)
  end
end
