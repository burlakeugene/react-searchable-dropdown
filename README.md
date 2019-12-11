## Burlak React Modal

```
npm i --save burlak-react-modal
```

```
import Modal from 'burlak-react-modal';
<Modal
	dark
	title={'Hi!'}
	className={'my-modal'}
	opened={this.state.bool}
	maxWidth={400}
	beforeHide={(instance) => {}}
	onShow={(instance) => {}}
	onHide={(instance) => {
		this.setState({
			bool: false
		});
	}}
	buttons={[{
		text: 'Cancel',
		type: 'error',
		onClick: (e, instance) => {
			console.log(e, instance);
		}
	},{
		text: 'Send',
		type: 'success',
		onClick: (e, instance) => {
			console.log(e, instance);
		}
	}]}
>
	Test modal
</Modal>
```
