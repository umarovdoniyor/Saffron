/**
 * Restaurant User Dashboard - Isolated Component
 *
 * Features:
 * - Personal info management (view, edit, delete account)
 * - Order lifecycle tracking (Paused → Active → History)
 * - Order management (checkout, proceed, finish)
 * - Confirmation dialogs for critical actions
 * - Scoped CSS - does not affect rest of application
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import {
  deleteAccount,
  deleteOrder,
  Order,
  setOrders as setOrdersAction,
  setUserInfo as setUserInfoAction,
  updateOrderStatus,
  updateUserInfo,
  UserInfo,
} from "../../store/slices/dashboardSlice";
import { logoutUser, fetchUserDetail } from "../../store/slices/authSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { memberApi } from "../../services/member.api";
import { orderApi } from "../../services/order.api";
import { productApi } from "../../services/product.api";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  X,
  Check,
  Clock,
  ShoppingBag,
  AlertCircle,
  Save,
  LogOut,
  Home,
} from "lucide-react";
import styles from "./RestaurantUserDashboard.module.css";

interface DashboardProps {
  userInfo?: UserInfo;
  orders?: Order[];
  onUpdateUser?: (updatedUser: UserInfo) => void;
  onDeleteAccount?: () => void;
  onOrderStatusChange?: (
    orderId: string,
    newStatus: "paused" | "active" | "completed",
  ) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export default function RestaurantUserDashboard({
  userInfo: initialUserInfo,
  orders: initialOrders,
  onUpdateUser,
  onDeleteAccount,
  onOrderStatusChange,
  onDeleteOrder,
}: DashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get user from auth state (logged in user)
  const authUser = useSelector((state: RootState) => state.auth.user);

  const dashboardUser = useSelector(
    (state: RootState) => state.dashboard.userInfo,
  );
  const dashboardOrders = useSelector(
    (state: RootState) => state.dashboard.orders,
  );

  // Convert auth user to dashboard UserInfo format
  const convertAuthUserToDashboardUser = (user: any): UserInfo | null => {
    if (!user) return null;
    return {
      id: user.id || "temp-user",
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      zipCode: user.zipCode || "",
      avatar: user.image || "",
      joinDate: new Date().toISOString(),
    };
  };

  // Prioritize auth user over props
  const defaultUserInfo =
    convertAuthUserToDashboardUser(authUser) ||
    dashboardUser ||
    initialUserInfo ||
    null;

  const fallbackUser: UserInfo = {
    id: "temp-user",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    avatar: "",
    joinDate: "",
  };

  // Get initial tab from URL parameter or default to 'profile'
  const initialTab =
    (searchParams.get("tab") as "profile" | "paused" | "active" | "history") ||
    "profile";

  const [activeTab, setActiveTab] = useState<
    "profile" | "paused" | "active" | "history"
  >(initialTab);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<UserInfo>(fallbackUser);
  const [userInfo, setUserInfo] = useState<UserInfo>(fallbackUser);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    type: "danger" | "warning";
  } | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Use Redux state directly for orders (always up-to-date)
  const orders = dashboardOrders;

  // Only initialize once when component mounts
  useEffect(() => {
    // Initialize user info only if not already set
    const userToUse = defaultUserInfo ?? fallbackUser;
    setUserInfo(userToUse);
    setEditedUser(userToUse);

    if (!dashboardUser) {
      dispatch(setUserInfoAction(userToUse));
    }

    // Fetch real orders from backend
    const fetchOrders = async () => {
      try {
        const backendOrders = await orderApi.getMyOrders({
          page: 1,
          limit: 50,
        });

        // Transform backend orders to dashboard format
        const transformedOrders = await Promise.all(
          backendOrders.map(async (order) => {
            // Fetch product details for each order item
            const items = await Promise.all(
              (order.orderItems || []).map(async (item) => {
                try {
                  const product = await productApi.getProduct(item.productId);
                  return {
                    id: item.productId,
                    name: product.name || product.title || "Unknown Product",
                    price: item.itemPrice,
                    quantity: item.itemQuantity,
                    image: product.image || product.thumb || "",
                    type: product.category?.[0] || "Food",
                  };
                } catch (error) {
                  return {
                    id: item.productId,
                    name: "Unknown Product",
                    price: item.itemPrice,
                    quantity: item.itemQuantity,
                    image: "",
                    type: "Food",
                  };
                }
              }),
            );

            // Map backend orderStatus to dashboard status
            let status: "paused" | "active" | "completed" = "active";
            if (order.orderStatus === "PAUSE") status = "paused";
            else if (order.orderStatus === "FINISH") status = "completed";
            else if (order.orderStatus === "PROCESS") status = "active";

            return {
              id: order._id,
              date: order.createdAt,
              status,
              items,
              totalPrice: order.orderTotal,
              restaurantName: "Saffron Table Restaurant",
              deliveryAddress: userInfo.address || "Not specified",
            };
          }),
        );

        dispatch(setOrdersAction(transformedOrders));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        // Fall back to mock orders if backend fails
        if (initialOrders && initialOrders.length > 0) {
          dispatch(setOrdersAction(initialOrders));
        }
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONLY on mount

  // Update local state when auth user changes (e.g., after fetchUserDetail)
  useEffect(() => {
    console.log("🔵 authUser changed:", authUser);
    if (authUser) {
      const updatedUser = convertAuthUserToDashboardUser(authUser);
      console.log("🔵 Converted to dashboard user:", updatedUser);
      if (updatedUser) {
        setUserInfo(updatedUser);
        if (!isEditingProfile) {
          setEditedUser(updatedUser);
        }
      }
    }
  }, [authUser, isEditingProfile]);

  // Filter orders by status (from Redux state)
  const pausedOrders = orders.filter((o) => o.status === "paused");
  const activeOrders = orders.filter((o) => o.status === "active");
  const completedOrders = orders.filter((o) => o.status === "completed");

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!editedUser) return;

    try {
      console.log("🔵 Saving profile:", editedUser);

      // Update backend with separate fields and optional image
      const updatedMember = await memberApi.updateMember(
        {
          memberNick: editedUser.name,
          memberPhone: editedUser.phone,
          memberEmail: editedUser.email,
          memberAddress: editedUser.address,
          memberCity: editedUser.city,
          memberZipCode: editedUser.zipCode,
        },
        selectedImage || undefined,
      );

      console.log("🟢 Backend updated successfully:", updatedMember);

      // Update local state
      setUserInfo(editedUser);
      dispatch(updateUserInfo(editedUser));

      // Refresh user data from backend and AWAIT it
      const freshUser = await dispatch(fetchUserDetail()).unwrap();
      console.log("🟢 Fresh user from backend:", freshUser);

      onUpdateUser?.(editedUser);
      setIsEditingProfile(false);
      setSelectedImage(null);
      setImagePreview(null);

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("🔴 Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  // Handle order status change
  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: "paused" | "active" | "completed",
  ) => {
    try {
      // Map dashboard status to backend status
      let backendStatus: string = "PROCESS";
      if (newStatus === "paused") backendStatus = "PAUSE";
      else if (newStatus === "completed") backendStatus = "FINISH";
      else if (newStatus === "active") backendStatus = "PROCESS";

      // Update backend
      await orderApi.updateOrder(orderId, backendStatus);

      // Update local state
      dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
      onOrderStatusChange?.(orderId, newStatus);

      toast.success(
        `Order ${newStatus === "completed" ? "completed" : "updated"} successfully!`,
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update order");
      console.error("Order update error:", error);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      // Update backend to mark as deleted
      await orderApi.updateOrder(orderId, "DELETE");

      // Update local state
      dispatch(deleteOrder(orderId));
      onDeleteOrder?.(orderId);

      toast.success("Order deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete order");
      console.error("Order delete error:", error);
    }
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    dispatch(deleteAccount());
    onDeleteAccount?.();
  };

  // Handle logout
  const handleLogout = () => {
    showConfirmDialog(
      "Logout?",
      "Are you sure you want to logout?",
      () => {
        // Clear all state
        dispatch(logoutUser());
        dispatch(deleteAccount()); // Clear dashboard state
        dispatch(clearCart()); // Clear cart
        // Navigate to home
        navigate("/");
      },
      "warning",
    );
  };

  // Confirmation dialog handlers
  const showConfirmDialog = (
    title: string,
    message: string,
    action: () => void,
    type: "danger" | "warning" = "warning",
  ) => {
    setConfirmDialog({ isOpen: true, title, message, action, type });
  };

  const confirmAction = () => {
    confirmDialog?.action();
    setConfirmDialog(null);
  };

  // Order card component
  const OrderCard = ({ order }: { order: Order }) => {
    const isExpanded = expandedOrderId === order.id;

    return (
      <div key={order.id} className={styles.orderCard}>
        {/* Order Header */}
        <div className={styles.orderHeader}>
          <div className={styles.orderInfo}>
            <h3 className={styles.orderRestaurant}>{order.restaurantName}</h3>
            <p className={styles.orderMeta}>Order ID: {order.id}</p>
            <p className={styles.orderMeta}>
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className={styles.orderPrice}>${order.totalPrice.toFixed(2)}</p>
            <span
              className={`${styles.orderStatus} ${
                order.status === "paused"
                  ? styles.orderStatusPaused
                  : order.status === "active"
                    ? styles.orderStatusActive
                    : styles.orderStatusCompleted
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className={styles.orderItemsPreview}>
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className={styles.orderItemBadge}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.orderItemImage}
              />
              <span className={styles.orderItemText}>
                {item.name} x{item.quantity}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <span className={styles.orderItemMore}>
              +{order.items.length - 3} more
            </span>
          )}
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className={styles.orderDetails}>
            <div>
              <h4 className={styles.orderDetailsTitle}>Order Items</h4>
              <div className={styles.orderDetailsList}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.orderDetailItem}>
                    <div className={styles.orderDetailItemLeft}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.orderDetailItemImage}
                      />
                      <div className={styles.orderDetailItemInfo}>
                        <p className={styles.orderDetailItemName}>
                          {item.name}
                        </p>
                        <p className={styles.orderDetailItemType}>
                          {item.type}
                        </p>
                      </div>
                    </div>
                    <div className={styles.orderDetailItemRight}>
                      <p className={styles.orderDetailItemPrice}>
                        ${item.price.toFixed(2)}
                      </p>
                      <p className={styles.orderDetailItemQty}>
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {order.deliveryAddress && (
              <p className={styles.orderDetailText}>
                <span className={styles.orderDetailTextStrong}>
                  Delivery Address:
                </span>{" "}
                {order.deliveryAddress}
              </p>
            )}
            {order.estimatedDelivery && (
              <p className={styles.orderDetailText}>
                <span className={styles.orderDetailTextStrong}>
                  Estimated Delivery:
                </span>{" "}
                {order.estimatedDelivery}
              </p>
            )}
            {order.notes && (
              <p className={styles.orderDetailText}>
                <span className={styles.orderDetailTextStrong}>Notes:</span>{" "}
                {order.notes}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.orderActions}>
          <button
            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
            className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>

          {activeTab === "paused" && (
            <button
              onClick={() =>
                showConfirmDialog(
                  "Proceed with Order?",
                  "This will move your order to active status.",
                  () => handleOrderStatusChange(order.id, "active"),
                  "warning",
                )
              }
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            >
              Proceed
            </button>
          )}

          {activeTab === "active" && (
            <button
              onClick={() =>
                showConfirmDialog(
                  "Finish Order?",
                  "Mark this order as completed.",
                  () => handleOrderStatusChange(order.id, "completed"),
                  "warning",
                )
              }
              className={`${styles.actionBtn} ${styles.actionBtnSuccess}`}
            >
              Finish
            </button>
          )}

          <button
            onClick={() =>
              showConfirmDialog(
                "Delete Order?",
                "This action cannot be undone.",
                () => handleDeleteOrder(order.id),
                "danger",
              )
            }
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <img
              src={
                userInfo.avatar
                  ? userInfo.avatar.startsWith("http")
                    ? userInfo.avatar
                    : userInfo.avatar.startsWith("uploads/")
                      ? `http://localhost:3003/${userInfo.avatar}`
                      : `${import.meta.env.VITE_UPLOAD_URL}/${userInfo.avatar}`
                  : "https://via.placeholder.com/80x80.png?text=User"
              }
              alt={userInfo.name}
              className={styles.headerAvatar}
            />
            <div>
              <h1 className={styles.headerTitle}>{userInfo.name}</h1>
              <p className={styles.headerSubtitle}>Member Dashboard</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => navigate("/")}
              className={styles.logoutBtn}
              title="Back to Home"
            >
              <Home size={20} />
            </button>
            <button
              onClick={handleLogout}
              className={styles.logoutBtn}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {[
            { id: "profile", label: "Profile", icon: "👤" },
            {
              id: "paused",
              label: `Paused (${pausedOrders.length})`,
              icon: "⏸",
            },
            {
              id: "active",
              label: `Active (${activeOrders.length})`,
              icon: "🔄",
            },
            {
              id: "history",
              label: `History (${completedOrders.length})`,
              icon: "✓",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Personal Info Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Personal Information</h2>
                  <p className={styles.cardSubtitle}>
                    Member since{" "}
                    {new Date(userInfo.joinDate).toLocaleDateString()}
                  </p>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className={styles.editBtn}
                  >
                    <Edit2 size={20} />
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                // Edit Form
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {/* Profile Picture Upload */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Profile Picture</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <img
                        src={
                          imagePreview ||
                          (userInfo.avatar
                            ? userInfo.avatar.startsWith("http")
                              ? userInfo.avatar
                              : userInfo.avatar.startsWith("uploads/")
                                ? `http://localhost:3003/${userInfo.avatar}`
                                : `${import.meta.env.VITE_UPLOAD_URL}/${userInfo.avatar}`
                            : "https://via.placeholder.com/80x80.png?text=User")
                        }
                        alt="Profile Preview"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #e5e7eb",
                        }}
                      />
                      <label style={{ cursor: "pointer" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                        <span
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            borderRadius: "0.375rem",
                            display: "inline-block",
                            fontSize: "0.875rem",
                          }}
                        >
                          Choose Image
                        </span>
                      </label>
                      {selectedImage && (
                        <span
                          style={{ fontSize: "0.875rem", color: "#6b7280" }}
                        >
                          {selectedImage.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Full Name</label>
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, name: e.target.value })
                        }
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email</label>
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            email: e.target.value,
                          })
                        }
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Phone</label>
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            phone: e.target.value,
                          })
                        }
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>City</label>
                      <input
                        type="text"
                        value={editedUser.city}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, city: e.target.value })
                        }
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Zip Code</label>
                      <input
                        type="text"
                        value={editedUser.zipCode}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            zipCode: e.target.value,
                          })
                        }
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Address</label>
                    <textarea
                      value={editedUser.address}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          address: e.target.value,
                        })
                      }
                      className={styles.formTextarea}
                    />
                  </div>

                  {/* Edit Actions */}
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className={styles.buttonPrimary}
                    >
                      <Save size={20} />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditedUser(userInfo);
                      }}
                      className={styles.buttonSecondary}
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Full Name</span>
                      <span className={styles.infoValue}>{userInfo.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email</span>
                      <span className={styles.infoValue}>
                        <Mail size={18} className={styles.infoIcon} />
                        {userInfo.email}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Phone</span>
                      <span className={styles.infoValue}>
                        <Phone size={18} className={styles.infoIcon} />
                        {userInfo.phone}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>City</span>
                      <span className={styles.infoValue}>{userInfo.city}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Zip Code</span>
                      <span className={styles.infoValue}>
                        {userInfo.zipCode}
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Address</span>
                    <span className={styles.infoValue}>
                      <MapPin size={18} className={styles.infoIcon} />
                      {userInfo.address}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className={styles.dangerZone}>
              <div className={styles.dangerZoneContent}>
                <AlertCircle className={styles.dangerZoneIcon} size={24} />
                <div className={styles.dangerZoneText}>
                  <h3 className={styles.dangerZoneTitle}>Danger Zone</h3>
                  <p className={styles.dangerZoneDescription}>
                    Deleting your account is permanent and cannot be undone. All
                    your data will be lost.
                  </p>
                  <button
                    onClick={() =>
                      showConfirmDialog(
                        "Delete Account?",
                        "This action is permanent and cannot be undone. All your data will be deleted.",
                        handleDeleteAccount,
                        "danger",
                      )
                    }
                    className={styles.dangerZoneBtn}
                  >
                    <Trash2 size={20} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paused Orders Tab */}
        {activeTab === "paused" && (
          <div>
            {pausedOrders.length > 0 ? (
              pausedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <Clock className={styles.emptyStateIcon} />
                <p className={styles.emptyStateText}>No paused orders</p>
              </div>
            )}
          </div>
        )}

        {/* Active Orders Tab */}
        {activeTab === "active" && (
          <div>
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <ShoppingBag className={styles.emptyStateIcon} />
                <p className={styles.emptyStateText}>No active orders</p>
              </div>
            )}
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === "history" && (
          <div>
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <Check className={styles.emptyStateIcon} />
                <p className={styles.emptyStateText}>No completed orders yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog?.isOpen && (
        <div className={styles.modal}>
          <div className={`${styles.modalContent} ${styles.fadeIn}`}>
            <div
              className={`${styles.modalIcon} ${
                confirmDialog.type === "danger"
                  ? styles.modalIconDanger
                  : styles.modalIconWarning
              }`}
            >
              <AlertCircle size={24} />
            </div>
            <h3 className={styles.modalTitle}>{confirmDialog.title}</h3>
            <p className={styles.modalMessage}>{confirmDialog.message}</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setConfirmDialog(null)}
                className={`${styles.modalActionBtn} ${styles.modalActionCancel}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`${styles.modalActionBtn} ${
                  confirmDialog.type === "danger"
                    ? styles.modalActionDanger
                    : styles.modalActionConfirm
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
