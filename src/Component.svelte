<script>
  import { getContext, createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  const { styleable } = getContext("sdk");
  const component = getContext("component");

  export let value = null;
  export let label = "Currency";

  let internalNumber = value;
  let inputElement;
  let id = Math.floor(Math.random()*100);

  const audFormatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  });

  onMount(() => {
    setTimeout(() => {
      formatAndDisplay(internalNumber);
    }, 0);
  });

  function formatAndDisplay(number) {
    if (inputElement) {
      if (number != null && Number.isFinite(number)) {
        inputElement.value = audFormatter.format(number);
      } else {
        inputElement.value = "";
      }
    }
  }

  function handleFocus() {
    if (internalNumber != null) {
      inputElement.value = String(internalNumber);
    } else {
      inputElement.value = "";
    }
  }

  function handleBlur() {
    const currentText = inputElement.value;
    const newNumber = currentText ? parseFloat(currentText.replace(/,/g, '')) : null;

    if (Number.isFinite(newNumber)) {
      internalNumber = newNumber;
    } else {
      internalNumber = null;
    }

    dispatch("setValue", internalNumber);
    formatAndDisplay(internalNumber);
  }
</script>

<div  class="bb-field" use:styleable={$component.styles}>
  <label for={id} class="spectrum-Body spectrum-Body--sizeS label">
    {label}
  </label>
  
  <input
    class="spectrum-Textfield input"
    {id}
    type="text"
    placeholder="$0.00"
    bind:this={inputElement}
    on:focus={handleFocus}
    on:blur={handleBlur}
  />
</div>

<style>
  .bb-field {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: var(--font-size-s);
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
    color: var(--spectrum-gray-800);
  }
  
  .input {
    height: 32px;
    width: 100%;
    text-align: right;
    border-radius: 4px;
  }
</style>