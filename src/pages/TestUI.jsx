import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { Heart, Settings, Mail } from 'lucide-react'

/**
 * Test page for UI components
 * Access at /test-ui to see all components
 */
export default function TestUI() {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            UI Components Test Page
          </h1>
          <p className="text-gray-600 mt-2">
            Test all UI components in different screen sizes
          </p>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Different button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Variants */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Variants</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Sizes</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">States</p>
                <div className="flex flex-wrap gap-2">
                  <Button loading={loading} onClick={() => setLoading(!loading)}>
                    Toggle Loading
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">With Icons</p>
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <Heart className="w-4 h-4 mr-2" />
                    With Icon
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Different badge variants and sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Variants</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Sizes</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inputs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Form inputs with different states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md">
              <Input
                label="Nome"
                placeholder="Digite seu nome"
                helperText="Este campo é obrigatório"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
              />
              <Input
                label="Campo com Erro"
                error="Este campo contém um erro"
                placeholder="Campo inválido"
              />
              <Input
                label="Campo Desabilitado"
                disabled
                value="Valor desabilitado"
              />
            </div>
          </CardContent>
        </Card>

        {/* Modal Section */}
        <Card>
          <CardHeader>
            <CardTitle>Modal</CardTitle>
            <CardDescription>Click to open modal</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
          </CardContent>
        </Card>

        {/* Cards Grid - Responsive */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Responsive Grid
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <Card key={num}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Card {num}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {num * 10}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Card with Footer */}
        <Card>
          <CardHeader>
            <CardTitle>Card with All Parts</CardTitle>
            <CardDescription>Header, Content, and Footer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is the main content area of the card. It can contain any content.
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">Cancel</Button>
              <Button className="flex-1">Save</Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Test Modal"
        description="This is a test modal to demonstrate the component"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is the modal content. You can add any content here.
          </p>
          <Input
            label="Example Input"
            placeholder="Type something..."
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
