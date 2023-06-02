import Vue from '@libs/vue/vue.min'
import ordersItem from "./components/orders/ordersItem";
import ordersAction from "./components/orders/ordersAction";
import ordersEmpty from "./components/orders/ordersEmpty";
import orderDetail from "./components/orders/orderDetail";
import order from './components/orders/order-modal';
import invoice from './components/pdf-invoice/pdf-quote'
import sendQuote from './components/pdf-invoice/send-quote'
import loader from "../loader";
import {fetchOrdersList, updateOrder, deleteOrder} from "./components/api";
import {toast} from '../utils/toast';
import store from '../frontend/store/orders';
import Vuex from '@libs/vue/vuex';

document.addEventListener("DOMContentLoaded", function() {
	Vue.use(Vuex)
	new Vue({
		el: "#calculator_orders",

		beforeCreate() {
			this.$store = new Vuex.Store(store);
		},

		components: {
			order,
			loader,
			ordersItem,
			ordersEmpty,
			ordersAction,
			orderDetail,
			invoice,
			sendQuote
		},

		data() {
			return {
				invoiceOrder: null,
				step: 'list',
				preloader: true,
				selectedOrder: null,
				bulkAction: 'none',
				selectAll: false,
				ordersList: [],
				ordersCount: 0,
				calculatorList: null,
				sort: {
					limit: 5,
					calc_id: 'all',
					payment: 'all',
					page: 1,
					sortBy: 'id',
					status: 'all',
					direction: 'desc',
				},
				sortDefault: {
					limit: 5,
					calc_id: 'all',
					payment: 'all',
					page: 1,
					sortBy: 'id',
					status: 'all',
					direction: 'desc',
				},
				pagination: {
					currentPage: 1,
					maxPages: 0,
				}
			}
		},

		computed: {
			isOrderSelected() {
				return this.selectedOrder;
			},

			noOrders() {
				return this.ordersList === null || this.ordersList?.length === 0;
			},

			selectedList() {
				if (this.ordersList) {
					return this.ordersList.filter(order => order.selected).map(order => order.id)
				} else {
					return []
				}
			},

			totalPages() {
				return Math.ceil(this.ordersCount / this.sort.limit);
			},

			getOrders() {
				return this.ordersList || [];
			},

			getOrderKey() {
				return this.selectedOrder?.id || 1;
			}
		},

		methods: {
			showModalSendPdf(order) {
				this.invoiceOrder = order
				this.$refs.sendQuote.showModal(order)
				setTimeout(() => {
					this.$refs.invoice.generateReport(false)
				}, 100)
			},

			generatePdf(order) {
				this.invoiceOrder = order
				setTimeout(() => {
					this.$refs.invoice.generateReport(true)
				}, 100)
			},
			reset() {
				this.selectedOrder = null;
				this.preloader = true;
			},

			nextPage() {
				this.sort.page++;
			},

			prevPage() {
				this.sort.page--;
			},

			getPage(page) {
				this.sort.page = page;
				this.reset();
				this.fetchData();
			},

			resetPage() {
				this.sort.page = 1;
			},

			saveFilter() {
				localStorage.setItem('ccb_filter', JSON.stringify(this.sort))
			},

			checkAll() {
				if (this.selectAll) {
					this.ordersList.forEach(order => {
						this.selectedList.push(order.id)
						order.selected = true
					})
				} else {
					this.ordersList.forEach(order => {
						order.selected = false
					})
				}
			},

			async updateMany() {
				const ids = this.selectedList.join(',')
				if (this.bulkAction === 'delete') {
					if (confirm('Are you sure do it?')) {
						await deleteOrder({ids});
						this.selectedOrder = null;
						setTimeout(() => toast('Order successfully deleted', 'success'), 400);
					}
				} else {
					await updateOrder({
						ids,
						status: this.bulkAction
					});
					setTimeout(() => toast('Orders successfully updated', 'success'), 400);
				}

				this.bulkAction = 'none'
				this.selectAll = false

				// this.resetPage()
				this.reset();
				await this.fetchData()
			},

			onSelected(id) {
				this.selectedList.push(id)
				this.ordersList = this.ordersList.map(order => {
					if (order.id === id) {
						order.selected = !order.selected
					}
					return order;
				})
			},

			isActiveSort(sortKey) {
				const isActive = sortKey === this.sort.sortBy
				let isAsc = isActive && this.sort.direction === 'asc'
				let isDesc = isActive && this.sort.direction === 'desc'

				if (!isAsc && !isDesc)
					isDesc = true;

				return {
					'sortable-asc': isAsc,
					'sortable-desc': isDesc,
				}
			},

			setSort(key) {
				this.sort.sortBy = key;
				if (this.sort.direction === 'asc') {
					this.sort.direction = 'desc';
				} else {
					this.sort.direction = 'asc';
				}
			},

			setOrderDetails(order) {
				this.selectedOrder = order;
			},

			async fetchData() {
				const orders = document.querySelector('.calculator-orders');
				if (!orders)
					return null;

				this.preloader = true;
				this.ordersList = null;

				const response = await fetchOrdersList({
					page: this.pagination.currentPage,
					...this.sort,
				})

				this.ordersList = response.data;
				this.ordersCount = response.total_count;
				this.calculatorList = response.calc_list;

				if ( +this.ordersCount === 0 ) {
					this.sort = this.sortDefault
					this.saveFilter()
				}

				if ( +this.ordersCount > 0 && this.ordersList.length === 0 && this.sort.page > 1 ) {
					this.sort.page -= 1;
					await this.fetchData()
					return false;
				}

				this.step = (this.calculatorList?.length > 0 && this.ordersList?.length === 0)
					? 'filter_no_orders'
					: 'list';

				setTimeout(() => this.preloader = false, 300);
			},

			initListeners() {
				document.body.addEventListener('click', e => {
					if (this.selectedOrder && e.target.classList.contains('ccb-allowed') === false) {
						this.setOrderDetails(null)
					}
				})

				document.body.addEventListener('keydown', e => {
					if (e.keyCode === 27 && this.selectedOrder) {
						this.setOrderDetails(null)
					}
				})
			},
		},

		async mounted() {
			if (localStorage.getItem('ccb_filter'))
				this.sort = JSON.parse(localStorage.getItem('ccb_filter'));

			this.$root.$on('showOrderDetail', order => this.$refs['order-modal'].open(order));
			await this.fetchData();
			this.initListeners()
		},

		watch: {
			sort: {
				deep: true,
				handler() {
					this.reset();
					this.saveFilter()
					this.fetchData();
				}
			},

			ordersList() {
				this.selectAll = this.selectedList.length === parseInt(this.sort.limit);
			}
		},
	})
})
