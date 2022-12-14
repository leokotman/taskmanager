class Api::V1::UsersController < Api::V1::ApplicationController
  # GET /api/v1/users/:id
  def show
    user = User.find(params[:id])

    respond_with(user, serializer: UserSerializer)
  end

  # GET /api/v1/users
  def index
    users = User.all.ransack(ransack_params).result

    respond_with(users, each_serializer: UserSerializer, meta: build_meta_users(users), root: 'items')
  end
end
