function renderTarget(container, targets) {
  container.innerHTML = targets
    .map(
      (goal) =>
        `<div class="goal-item">
        <img src="../../assets/icons/goal.svg" alt="Content Image" />
        <span style="color: var(--text-color)"
            >${goal}</span
        >
        </div>`
    )
    .join('');
}
