<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-zinc-900">Análise por IA</h2>
        <p class="text-sm text-zinc-500 mt-1">Prontuário #{{ id }}</p>
      </div>
      <router-link :to="`/medical-records/${id}`">
        <BaseButton variant="secondary">Voltar ao Prontuário</BaseButton>
      </router-link>
    </div>

    <!-- Upload -->
    <BaseCard title="Enviar Imagem para Análise">
      <UploadZone :disabled="loadingUpload" :filename="filename" :preview="preview" @select="onSelect" @analyze="upload" />
      <p v-if="loadingUpload" class="text-sm text-zinc-500 mt-3">Processando análise...</p>
      <ErrorState v-if="error" :message="error" />
    </BaseCard>

    <!-- Resultado -->
    <BaseCard v-if="analysis" title="Resultado da Análise">
      <ResultView :value="analysis" :onBack="() => {}" />

      <!-- Validação médica -->
      <div class="mt-6 pt-6 border-t border-zinc-200">
        <h3 class="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Validação Médica</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <BaseSelect v-model="validation.doctor_agreement" label="Concordância">
            <option value="YES">Concordo</option>
            <option value="NO">Discordo</option>
            <option value="PARTIAL">Concordo parcialmente</option>
          </BaseSelect>
          <BaseInput v-model="validation.doctor_final_assessment" label="Avaliação final" placeholder="Diagnóstico final do médico" />
        </div>
        <div class="mt-4">
          <BaseTextarea v-model="validation.doctor_notes" label="Observações" :rows="3" placeholder="Notas adicionais do médico..." />
        </div>
        <div class="mt-4">
          <BaseButton @click="validateAI" :disabled="validating">
            {{ validating ? 'Validando...' : 'Confirmar Validação' }}
          </BaseButton>
        </div>
        <p v-if="validated" class="text-emerald-600 mt-3 text-sm">Validação registrada com sucesso!</p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import UploadZone from '../components/UploadZone.vue'
import ResultView from '../components/ResultView.vue'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BaseTextarea from '../components/BaseTextarea.vue'
import BaseButton from '../components/BaseButton.vue'
import ErrorState from '../components/ErrorState.vue'
import { documentService } from '../services/documentService'
import { aiService } from '../services/aiService'

const id = useRoute().params.id
const file = ref(null)
const filename = ref('')
const preview = ref('')
const loadingUpload = ref(false)
const error = ref('')
const analysis = ref(null)
const analysisId = ref(null)
const validating = ref(false)
const validated = ref(false)

const validation = reactive({
  doctor_agreement: 'YES',
  doctor_final_assessment: '',
  doctor_notes: '',
})

const onSelect = (f) => {
  file.value = f
  filename.value = f.name
  preview.value = URL.createObjectURL(f)
}

const upload = async () => {
  try {
    loadingUpload.value = true
    error.value = ''
    const doc = await documentService.upload({ file: file.value, medical_record_id: id })
    const result = await aiService.analyze({ medical_record_id: id, document_id: doc.id || doc.document_id })
    analysis.value = result
    analysisId.value = result.id
  } catch {
    error.value = 'Erro no fluxo de análise. Verifique a imagem enviada.'
  } finally {
    loadingUpload.value = false
  }
}

const validateAI = async () => {
  if (!analysisId.value) return
  validating.value = true
  validated.value = false
  try {
    await aiService.validate(analysisId.value, validation)
    validated.value = true
  } catch {
    error.value = 'Erro ao registrar validação médica'
  } finally {
    validating.value = false
  }
}
</script>
