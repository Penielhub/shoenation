"""User management. Every route here is admin-only."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_admin
from ..models import User
from ..schemas import RoleUpdate, UserOut

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(require_admin)])


@router.get("", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.id).all()


@router.patch("/{user_id}/role", response_model=UserOut)
def update_role(user_id: int, data: RoleUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    if user_id == admin.id:
        # stops an admin from accidentally demoting themselves and leaving no admin behind
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You can't change your own role")
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.role = data.role
    db.commit()
    db.refresh(user)
    return user
